import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ICat } from "../../../models/cat.model";
import { IComment } from "../../../models/comment.model";

@Component({
    selector: 'app-create-comment',
    templateUrl: './create-comment.component.html'
})

export class CreateCommentComponent implements OnInit {

    cat: ICat | null = null;

    form: FormGroup = new FormGroup({
        cat: new FormControl('', [Validators.required]),
        text: new FormControl('', [Validators.required]),
        note: new FormControl('', [Validators.required])
    })

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
    ) { }

    ngOnInit(): void {
        this.cat = this.config.data.cat;
    }

    add(): void {
        const comment: IComment = {
            cat: this.cat!.id!,
            text: this.form.get('text')?.value,
            note: this.form.get('note')?.value
        }

        // dispatch action
        this.ref.close(comment);
    }

    close(): void {
        this.ref.close();
    }

}