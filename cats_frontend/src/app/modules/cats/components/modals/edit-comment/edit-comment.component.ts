import { Component } from "@angular/core";
import { IComment } from "../../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CommentsService } from "../../../services/comments.service";

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
        private commentsService: CommentsService,
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

    update() {
        const comment: IComment = {
            id: this.comment!.id!,
            cat: this.form.get('cat')?.value,
            text: this.form.get('text')?.value,
            note: this.form.get('note')?.value
        }

        this.commentsService.update(comment).subscribe((comment) => {
            this.ref.close(comment);
        });
    }

    close() {
        this.ref.close();
    }
}
