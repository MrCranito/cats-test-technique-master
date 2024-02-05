import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ICat } from "../../../models/cat.model";
import { CommentsService } from "../../../services/comments.service";
import { IComment } from "../../../models/comment.model";
import { MessageService } from "primeng/api";

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
        private commentsService: CommentsService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
    ) { }

    ngOnInit(): void {
        this.cat = this.config.data.cat;
    }

    add() {
        const comment: IComment = {
            cat: this.cat!.id!,
            text: this.form.get('text')?.value,
            note: this.form.get('note')?.value
        }

        this.commentsService.create(comment).subscribe((comment) => {
            this.ref.close(comment);
        });
    }

    close() {
        this.ref.close();
    }

}