import { Room } from "../../../type";
import { User } from "../../../type";

export class SelectClass {
	value: string;
	label: string;

	constructor(obj: Room | User) {
        if (obj.hasOwnProperty('userUuid')) {
            
            this.value = (obj as User).userUuid;
            this.label = (obj as User).userName;
            console.log("SELECT CLASS user", obj, this);
        } else if (obj.hasOwnProperty('id')) {
            this.value = (obj as Room).id;
            this.label = (obj as Room).name;
        } else  {
            throw new Error('Object does not have a userUuid or id property');
        }
	}



}
