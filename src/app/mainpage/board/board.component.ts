import { Component, Input } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { CompactTaskComponent } from '../../shared/compact-task/compact-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TasksFirbaseService } from '../../shared/services/tasks-firbase.service';
import { Tasks } from '../../../interfaces/tasks';
import { doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CompactTaskComponent, TaskDetailComponent, DragDropModule, CdkDrag, CdkDropList],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(public taskService: TasksFirbaseService) {}
  @Input() selcetedTask: Tasks | null = null;

  isTaskDetailVisible = false;
  selectedTaskForDetail: Tasks | null = null;

  todo: Tasks[] = [];

  inprogress: Tasks[] = [];

  awaitfeedback: Tasks[] = [];

  done: Tasks[] = [];

  get todoTasks() {
    this.todo = this.taskService.tasks.filter((task) => task.status === 'todo');
    return this.todo;
  }

  get inProgressTasks() {
    this.inprogress = this.taskService.tasks.filter(
      (task) => task.status === 'inprogress'
    );
    return this.inprogress;
  }

  get awaitFeedbackTasks() {
    this.awaitfeedback = this.taskService.tasks.filter(
      (task) => task.status === 'awaitfeedback'
    );
    return this.awaitfeedback;
  }

  get doneTasks() {
    this.done = this.taskService.tasks.filter((task) => task.status === 'done');
    return this.done;
  }

  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    const movedTask = event.container.data[event.currentIndex];
    const newStatus = this.getStatusByArray(event);
    if (movedTask && newStatus) {
      movedTask.status = newStatus;
      if (typeof movedTask.id === 'string') {
        this.taskService.updateTaskStatus(movedTask.id, { status: newStatus });
      }
    }
    }
  }

private getStatusByArray(event: CdkDragDrop<Tasks[]>) {
  const id = (event.container.id as string);
  if (id.includes('todo')) return 'todo';
  if (id.includes('inprogress')) return 'inprogress';
  if (id.includes('awaitfeedback')) return 'awaitfeedback';
  if (id.includes('done')) return 'done';
  return '';
}

  openTaskDetail(task: Tasks) {
    this.selectedTaskForDetail = task;
    this.isTaskDetailVisible = true;
  }

  closeTaskDetail() {
    this.isTaskDetailVisible = false;
    // Nach der Animation das selectedTask zurücksetzen
    setTimeout(() => {
      this.selectedTaskForDetail = null;
    }, 300);
  }
}
