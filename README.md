# Classcraft UML Studio

A responsive React application for building UML class diagrams and generating Java source files.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`.

## Using the studio

- Add, edit, or delete classes, including their UML visibility, attributes, and methods.
- Drag class cards around the canvas and use the zoom controls to change the diagram scale.
- Open **Relationships** to add, edit, or remove associations, inheritance, and dependencies.
- Select **Generate Java** to preview, copy, or download each class as a `.java` file.
- The current diagram is saved automatically in the browser's local storage.

The starter diagram demonstrates associations between `User`, `Order`, and `Product`. Generated methods contain a `TODO` implementation body so the resulting Java files are ready to extend.
