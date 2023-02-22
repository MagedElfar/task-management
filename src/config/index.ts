import { Assignment } from 'src/assignments/assignments.entity';
import { Project } from './../projects/project.entity';
import { UsersPhotos } from './../users-photo/users-photo.entity';
import { User } from './../users/user.entity';
import { Task } from './../tasks/task.entity';
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Profile } from 'src/profile/profile.entity';
import { Team } from 'src/teams/team.entity';


export default () => ({
    port: process.env.PORT,
    jwt: {
        secret: process.env.TOKEN_SECRET,
        accessTokenExpire: process.env.Access_Token_Expire,
        refreshTokenExpire: process.env.Refresh_Token_Expire
    },
    typeOrm: <TypeOrmModuleOptions>{
        type: "mysql",
        host: process.env.DB_HOST,
        port: + process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        entities: [Task, User, Profile, UsersPhotos, Project, Team, Assignment],
        synchronize: true,
    }
})