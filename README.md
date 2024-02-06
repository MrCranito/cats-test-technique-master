# Rate my cat

## Goal

The goal of this interview is to develop an angular SPA based on this API that will allow users to rate cats. The application should allow users to:

- Add a cat, with a name, a breed and a birthday.
- See a list of cats, with their average score and:
  - order them by either their name, their breed, or their average score.
  - filter them by their breed or their average score.
  - search them by their name.
  - the list should be paginated.
- See more details about a cat.
- Update details about a cat if there was a mistake (name, breed or birthday).
- Rate a cat with an optional comment
- See the comments of a cat with their notes.

## API

### requirements

- docker
- docker-compose

### How to run

```bash
docker-compose up -d --build
docker-compose exec web python manage.py migrate
cd cats_frontend
npm install
ng serve
```

### Launch 

Launch [site](http://localhost:4200)

### How to use

The API is available at [http://localhost:8000/v1](http://localhost:8000/v1) and the documentation at [http://localhost:8000/docs](http://localhost:8000/docs)