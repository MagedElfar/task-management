import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Project } from 'src/projects/project.entity';

export enum MemberRole {
    ADMIN = "admin",
    Member = "member"

}

@Entity({ name: "teams" })
export class Team extends AbstractEntity {
    @Column({
        type: "enum",
        enum: MemberRole,
        default: MemberRole.Member
    })
    @Exclude()
    role: string;

    @ManyToOne(() => User, (user) => user.teams, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    user: User

    @ManyToOne(() => Project, (project) => project.teams, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    project: Project

    @Column({
        nullable: true
    })
    userId: number

    @Column()
    projectId: number
}