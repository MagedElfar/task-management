import { Task } from 'src/tasks/task.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';

@Entity({ name: "projects" })
export class Project extends AbstractEntity {
    @Column()
    @Exclude()
    projectName: string;

    @ManyToOne(() => User, (user) => user.projects, {
        onDelete: "SET NULL",
        onUpdate: 'CASCADE'
    })
    user: User

    @OneToMany(() => Team, (team) => team.project, {
        cascade: true
    })
    teams: Team[]

    @OneToMany(() => Task, (task) => task.project, {
        cascade: true,
    })
    tasks: Task[]

    @Column({
        nullable: true
    })
    userId: number
}