import { Task } from 'src/tasks/task.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';


@Entity({ name: "assignments" })
export class Assignment extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.assignmentFrom, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    assignmentsFrom: User

    @ManyToOne(() => User, (user) => user.assignmentTo, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    assignmentsTo: User


    @ManyToOne(() => Task, (task) => task.assignments, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    task: Task

    @Column({
        nullable: true

    })
    taskId: number

    @Column({
        nullable: true

    })
    assignmentsToId: number

    @Column({
        nullable: true

    })
    assignmentsFromId: number
}