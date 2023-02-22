import { Assignment } from 'src/assignments/assignments.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

export enum TaskStatus {
    OPEN = "open",
    IN_PROGRESS = "in progress",
    DONE = "done",
    IN_REVIEW = "in review"
}


export enum TaskPriority {
    HEIGH = "heigh",
    MEDIUM = "medium",
    LOW = "low"
}

@Entity({ name: "tasks" })
export class Task extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.OPEN
    })
    status: TaskStatus;

    @Column({
        type: "enum",
        enum: TaskPriority,
        default: TaskPriority.LOW
    })
    priority: TaskPriority;

    @Column({
        type: "datetime",
        default: "2023-02-22"
    })
    duo_date: Date;

    @ManyToOne(() => User, (user) => user.tasks, {
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
    })
    user: User

    @ManyToOne(() => Project, (project) => project.tasks, {
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
    })
    project: Project

    @ManyToOne(() => Task, (task) => task.subTasks, {
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
    })
    parent: Task

    @OneToMany(() => Task, (task) => task.parent, {
        cascade: true
    })
    subTasks: Task[]

    @OneToMany(() => Assignment, (assignment) => assignment.task, {
        cascade: true
    })
    assignments: Assignment[]


    @Column()
    userId: number

    @Column({
        nullable: true
    })
    projectId: number

    @Column({
        default: null,
        nullable: true
    })
    parentId: number
}