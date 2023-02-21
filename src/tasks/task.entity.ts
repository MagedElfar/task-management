import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';

export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
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

    @Column()
    userId: number



}