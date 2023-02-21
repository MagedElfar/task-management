import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';


export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

@Entity({ name: "profiles" })
export class Profile extends AbstractEntity {
    @Column({
        nullable: true
    })
    @Exclude()
    firstName: string;

    @Column({
        nullable: true
    })
    @Exclude()
    lastName: string;

    @Column({
        nullable: true,
        type: "enum",
        enum: Gender
    })
    @Exclude()
    gender: string;

    @Column()
    @Exclude()
    phone: string

    @OneToOne(() => User, (user) => user.profile, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    user: User

    @Column()
    userId: number

}