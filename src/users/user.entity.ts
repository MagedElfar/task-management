import { Assignment } from 'src/assignments/assignments.entity';
import { UsersPhotos } from './../users-photo/users-photo.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Profile } from 'src/profile/profile.entity';
import { Task } from 'src/tasks/task.entity';
import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Project } from 'src/projects/project.entity';
import { Team } from 'src/teams/team.entity';

@Entity({ name: "users" })
export class User extends AbstractEntity {
    @Column({
        unique: true
    })
    @Exclude()
    username: string;

    @Column({
        unique: true
    })
    @Exclude()
    email: string

    @Column()
    @Exclude()
    password: string

    @OneToMany(() => Task, (task) => task.user, {
        cascade: true
    })
    tasks: Task[]

    @OneToMany(() => Project, (project) => project.user, {})
    projects: Project[]

    @OneToMany(() => Team, (team) => team.user, {
        cascade: true
    })
    teams: Team[]

    @OneToMany(() => Assignment, (assignment) => assignment.assignmentsTo, {
        cascade: true
    })
    assignmentTo: Assignment[]


    @OneToMany(() => Assignment, (assignment) => assignment.assignmentsFrom, {
        cascade: true
    })
    assignmentFrom: Assignment[]


    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile

    @OneToOne(() => UsersPhotos, (photo) => photo.user)
    photo: UsersPhotos
}