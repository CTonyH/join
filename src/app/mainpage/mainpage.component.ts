import { Component, OnInit } from '@angular/core';
import { TasksFirbaseService } from '../shared/services/tasks-firbase.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Tasks } from '../../interfaces/tasks';
import { AuthService } from '../shared/services/auth.service';

/**
 * Main dashboard component displaying task overview and greeting.
 */
@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent implements OnInit {
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  animationStarted = false;

  /**
   * @param taskService - Service for task operations
   * @param authService - Service for authentication
   * @param router - Angular router for navigation
   */
  constructor(
    public taskService: TasksFirbaseService,
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Initializes component and sets up subscriptions.
   */
  ngOnInit() {
    this.taskService.tasksChanged.subscribe(() => {
      this.nextDeadlineInfo;
    });
    if (this.authService.checkAndResetSuccessMessage()) {
      this.showSuccessMessageBox('You have successfully logged in <3');
    }
    this.checkAnimation();
    this.authService.wasJustLoggedIn = false;
  }

  /**
   * Checks and manages login animation state.
   */
  checkAnimation() {
    if (!this.animationStarted && this.authService.wasJustLoggedIn) {
      this.animationStarted = true;
      setTimeout(() => {
        this.animationStarted = false;
      }, 2500);
    }
  }

  /**
   * Gets the logged-in person's display name.
   */
  getLogedInPerson() {
    return this.authService.displayName || 'Guest';
  }

  /**
   * Gets time-based greeting message.
   */
  getGreeting() {
    let dateTime = new Date();
    let hour = dateTime.getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  }

  /**
   * Gets the number of tasks by status.
   *
   * @param task - Task status to filter by
   */
  getNumberOftasks(task: string) {
    return this.taskService.tasks.filter((t) => t.status === task).length;
  }

  /**
   * Converts task date to Date object.
   *
   * @param task - Task containing date
   */
  private getTaskDate(task: Tasks): Date {
    return task.date instanceof Date ? task.date : task.date.toDate();
  }

  /**
   * Gets task date as timestamp.
   *
   * @param task - Task containing date
   */
  private getTaskTime(task: Tasks): number {
    return this.getTaskDate(task).getTime();
  }

  /**
   * Formats priority string with proper capitalization.
   *
   * @param priority - Priority string to format
   */
  private formatPriority(priority: string): string {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : '';
  }

  get nextDeadlineInfo() {
    const nextTask = this.filterDeadlineTasks();
    if (!nextTask) {
      return { count: 0, priority: '', date: '' };
    }
    const dateToCompare = this.getTaskTime(nextTask);
    const sameTasks = this.taskService.tasks.filter(
      (task) =>
        task.date &&
        task.status !== 'done' &&
        this.getTaskTime(task) === dateToCompare &&
        task.priority === nextTask.priority
    );

    return {
      count: sameTasks.length,
      priority: this.formatPriority(nextTask.priority),
      date: this.convertDate(nextTask),
    };
  }

  /**
   * Converts task date to formatted string.
   *
   * @param task - Task containing date to convert
   */
  convertDate(task: Tasks | null): string {
    if (!task || !task.date) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    if (task.date instanceof Date) {
      return task.date.toLocaleDateString('en-EN', options);
    }
    if (typeof task.date.toDate === 'function') {
      return task.date.toDate().toLocaleDateString('en-En', options);
    }
    return '';
  }

  /**
   * Filters and sorts tasks by deadline and priority.
   */
  filterDeadlineTasks() {
    const prioOrder: Record<string, number> = { urgent: 1, medium: 2, low: 3 };
    const today = new Date().setHours(0, 0, 0, 0);
    const upcomingTasks = this.taskService.tasks
      .filter((task) => {
        if (!task.date || task.status === 'done') return false;
        const taskDate = this.getTaskDate(task);
        return taskDate.setHours(0, 0, 0, 0) >= today;
      })
      .sort((a, b) => {
        const dateA = this.getTaskDate(a).getTime();
        const dateB = this.getTaskDate(b).getTime();
        if (dateA !== dateB) return dateA - dateB;

        return prioOrder[a.priority] - prioOrder[b.priority];
      });
    return upcomingTasks.length > 0 ? upcomingTasks[0] : null;
  }

  /**
   * Shows a success message to the user.
   *
   * @param message - Success message to display
   */
  showSuccessMessageBox(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
  }
}
