import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';


@Entity({ name: "users_photos" })
export class UsersPhotos extends AbstractEntity {

    @Column()
    @Exclude()
    url: string

    @OneToOne(() => User, (user) => user.photo, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    user: User

    @Column()
    userId: number

}