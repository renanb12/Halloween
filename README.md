```markdown
# Halloween Quiz Game 🎃

## Project Description
This project is a Halloween-themed quiz game. Players answer questions related to Halloween and accumulate scores. Each user has an individual account where their highest, lowest, and current scores are saved and displayed in a user interface.

The game is built with HTML, CSS, and JavaScript on the front end, while the back end uses Express.js with MySQL for data storage.

## Setup and Installation

### Required Dependencies
Make sure to have the following installed before starting:

- **Node.js**: To run the Express.js server.
- **MySQL**: For the database where user and score data are stored.

Use `npm` to install project dependencies:

```bash
npm install express mysql jsonwebtoken bcrypt dotenv
```

### Installation and Configuration Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/renanb12/Halloween.git
   cd Halloween
   ```

2. **Database Setup**:
   - Use the SQL commands below to create the MySQL database and the necessary tables for the project.

### SQL Commands to Create Database and Tables

```sql
CREATE DATABASE IF NOT EXISTS halloween;
USE halloween;

CREATE TABLE users (
id INT NOT NULL UNIQUE AUTO_INCREMENT,
name varchar(200),
email varchar(200),
password varchar(200),
maxScore DECIMAL(10, 2),
minScore DECIMAL(10, 2),
score DECIMAL(10, 2),
PRIMARY KEY(id)
);
```

### Running the Server

1. **Start the server**:
   ```bash
   node server.js
   ```

   The server should start at `http://localhost:3000`.

2. **Access the Project**:
   Open `http://localhost:3000` in a browser to access the game.

## Usage

- **Login and Registering New Users**: 
  - On the homepage, new users can sign up, and existing users can log in.
  
- **Starting the Game**:
  - After logging in, users are redirected to a screen asking if they want to start the game.
  - Clicking "Play" will take them to the quiz.

- **User Info and Scores**:
  - During the game, users accumulate points, which are automatically saved at the end of each session.
  - Users can access their highest score (`maxScore`), lowest score (`minScore`), and the score from their last game (`score`) on the user info page.

## Authors

<table>
  <tr>
  <td align="center">
      <a href="#" title="Vitor Gabriel">
        <img src="https://avatars.githubusercontent.com/u/79713907?v=4" width="100px;" alt="Vitor Gabriel"/><br>
        <sub>
          <b>Vitor Gabriel</b>
        </sub>
      </a>
    </td>

<td align="center">
      <a href="#" title="Renan Bernardo">
        <img src="https://cdn.discordapp.com/attachments/1204827550946168884/1299534491320320081/412695563_1429922514263509_8172059649901029130_n.png?ex=671d8d4e&is=671c3bce&hm=1820d12bb760755f715c4177039a19f66acfa9feeabb055846a94ac298a3fe1f&" width="100px;" alt="Renan Bernardo"/><br>
        <sub>
          <b>Renan Bernardo</b>
        </sub>
      </a>
    </td>

<td align="center">
      <a href="#" title="Felype Echer">
        <img src="https://avatars.githubusercontent.com/u/127792707?v=4" width="100px;" alt="Felype"/><br>
        <sub>
          <b>Felype Echer</b>
        </sub>
      </a>
    </td>

<td align="center">
      <a href="#" title="Luiz Bataioli">
        <img src="https://avatars.githubusercontent.com/u/136658924?v=4" width="100px;" alt="Luiz"/><br>
        <sub>
          <b>Luiz Bataioli</b>
        </sub>
      </a>
    </td>

<td align="center">
      <a href="#" title="Marcelo Boeira">
        <img src="https://avatars.githubusercontent.com/u/136658914?v=4" width="100px;" alt="Luiz"/><br>
        <sub>
          <b>Marcelo Boeira</b>
        </sub>
      </a>
    </td>
  </tr>

</table>
