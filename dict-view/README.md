# dict-view

Build-Result of this project is integrated in top-level project.

Before the top-level project (alpha-)dxtionary can be packaged, one must run

```
make all
```

from top-leve project to create the directory `../resource`.

If filenames in this project are changed, so the generated file in `../resource` also
changed. Therfore constants, in `../src/extensions.ts`, which point to these files
must be addapted.


## Fast test
To try something, just call `parcel serve template.html`. 

## Notes
`renderjson` is a copy with small chang from `https://github.com/caldwell/renderjson`.
It just shows structure of result from database, and will be replaced as soon as an optical design
finish is.

