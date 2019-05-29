const express = require("express");
const app = express();
const port = 3000;
const connection = require("./conf");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/api/games", (req, res) => {
  connection.query("SELECT * from games", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/games/game", (req, res) => {
  connection.query("SELECT name, release_date, theme from games", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});


app.get("/api/games/starts_with_star", (req, res) => {
  connection.query("SELECT * from games WHERE name LIKE 'Star%'", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/games/includes_ar", (req, res) => {
  connection.query("SELECT * from games WHERE name LIKE '%ar%'", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/games/after_2017", (req, res) => {
  connection.query("SELECT * from games WHERE release_date > '2017/12/31'", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/games/:order", (req, res) => {
  const order = req.params.order
  
  connection.query(`SELECT name from games ORDER BY name ${order}`, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des jeux");
    } else {
      res.json(results);
    }
  });
});

app.post("/api/games", (req, res) => {
  const formData = req.body; 

  connection.query("INSERT INTO games SET ?", [formData], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un jeu.");
    } else {
      res.sendStatus(200);
    }
  });
});

app.put("/api/games/:id", (req, res) => {
  const idGame = req.params.id;
  const formData = req.body;
  connection.query(
    "UPDATE games SET ? WHERE id = ?",
    [formData, idGame],
    err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'un jeu");
      } else {
        res.sendStatus(200);
      }
    }
  );
});


app.put("/api/games/update/:id", (req, res) => {
  const idGame = req.params.id;
  connection.query(
    "UPDATE games SET have_i_played_it = NOT have_i_played_it WHERE ID = ?",
    [idGame],
    err => {
      if (err) {
        console.log(err); 
        res.status(500).send("Erreur lors de la modification d'un jeu");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.delete("/api/games/:id", (req,res) => {
  const idGame = req.params.id;
  connection.query('DELETE FROM games WHERE id = ?', [idGame], err => {
    
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un jeu");
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete("/api/games", (req,res) => {
  connection.query('DELETE FROM games WHERE have_i_played_it = 0', err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression des jeux");
    } else {
      res.sendStatus(200);
    }
  });
});


app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened ...");
  }

  console.log(`In the ${port} port, sailors sing`);
});
