import { Component } from "@angular/core";
import { IComment } from "../../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-edit-comment',
    templateUrl: './edit-comment.component.html'
})

export class EditCommentComponent {

    comment: IComment | null = null;

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
        this.comment = this.config.data.comment;
        this.form.setValue({
            cat: this.comment?.cat,
            text: this.comment?.text,
            note: this.comment?.note
        })
    }

    update(): void {
        const comment: IComment = {
            id: this.comment!.id!,
            cat: this.form.get('cat')?.value,
            text: this.form.get('text')?.value,
            note: this.form.get('note')?.value
        }

        this.ref.close(comment);
    }

    close(): void {
        this.ref.close();
    }
}
