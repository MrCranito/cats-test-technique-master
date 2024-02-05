from django.db import models
from django_extensions.db.models import TimeStampedModel


class Cat(models.Model):
    name = models.CharField(max_length=255, help_text="name of the cat")
    breed = models.CharField(
        max_length=255, default="cat", help_text="breed of the cat"
    )
    description = models.TextField(
        blank=True, help_text="description of the quality of the awesomeness of the cat"
    )
    birthday = models.DateField(help_text="birthday of the cat")

    def __str__(self) -> str:
        return self.name


class Comment(TimeStampedModel, models.Model):
    cat = models.ForeignKey(Cat, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    note = models.IntegerField()

    def __str__(self):
        return f"{self.cat.name} - {self.note}"
