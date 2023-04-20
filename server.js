//requiring the packages we need
const express = require("express");
const path = require("path");
const fs = require("fs");

//set port to 3001
const PORT = 3001;

//initalise express
const app = express();

// to convert client side data to be parsed to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  console.info(req.body);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNote = JSON.parse(data);
      return res.json(parsedNote);
    }
  });
});

// write the new note to db.json
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to get reviews`);

  const { title, text } = req.body;

  if (title && text) {
    const newEntry = {
      title,
      text,
      note_id: uuid(),
      //replace uuid() with function to make unique id
    };

    // read existing databased
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      //do i need to specify utf8?
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedDB = JSON.parse(data);

        // push a new note
        parsedDB.push(newEntry);

        // Write updated note back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedDB, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
          //rewrite if statement
        );
      }
    });

    //sets the response to the generated entry text
    const response = {
      status: "success",
      body: newEntry,
    };

    console.log(response);
    res.status(201).json(response);
    //201 code for post request success
  } else {
    //501 error for server side error
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
