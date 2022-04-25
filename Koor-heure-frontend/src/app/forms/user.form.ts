import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Coord, Run, UserModel } from "../models/user.model";


@Injectable()
export class UserForm{
    constructor(private formBuilder: FormBuilder){

    }

    createUserForm(user: UserModel) : FormGroup{
        return this.formBuilder.group({
            name: [user.name,Validators.required],
            email:  [user.email,Validators.required],
            password:  [user.password,Validators.required],
            admin:  [user.admin, Validators.required],
            lastRun :  this.createRunForm(user.lastRun!),
            runs: this.createRunsFormArray(user.runs!)
        })
    }

    private createRunsFormArray(run : Run[]){
        if(!run){
            run = [];
        }
        let runArray = [];
        for(let r of run){
            runArray.push(this.createRunForm(r));
        }
        return this.formBuilder.array(runArray);

    }
    private createRunForm(run : Run) {
        return this.formBuilder.group({
            distance: [run.distance],
            duration: [run.duration],
            date: [run.date],
            speed: [run.speed],
            routeCoordinates: this.createRouteCoordinatesForm(run.routeCoordinates!)
        })
    }

    private createRouteCoordinatesForm(coord: Coord[]) {
        if(!coord){
            coord = [];
        }
        let coordArray = [];
        for(let c of coord){
            coordArray.push(this.createRouteCoordinateForm(c));
        }
        return this.formBuilder.array(coordArray);
    }
    private createRouteCoordinateForm(coord : Coord){
        return this.formBuilder.group({
            latitude: [coord.latitude],
            longitude: [coord.longitude]
        })
    }
}
