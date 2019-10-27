const Discord = require('discord.js');

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'redacted',
  port: 5432,
})

const clien = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'redacted',
  port: 5432,

})

// WHERE
//   userid NOT IN (${message.author.id})
// INSERT INTO Classes(userid, username)
// VALUES (${message.author.id}, '${message.author.username}')

// INSERT INTO public."Classes"(period_one, period_two, period_three, period_four, period_five, period_six, period_seven, period_eight, period_nine)
// VALUES ('English','1-800-222-0451', 'English', 'English', 'English', 'English', 'English','English','English');

// Consumer Math - 1001
// US History I - 1002
// Geometry - 1003
// Sign Language II - 1004
// English - 1005
// Programming - 1006
// Lunch - 1007
// Drivers Education - 1008
// Chemistry - 1009
clien.connect()
module.exports = {
  name: 'schedule',
  description: `will display the user's class schedule`,
  execute(message, args){
    const exampleEmbed = {
        color: 0x0099ff,
        title: `${message.author.username}'s Schedule`,
        url: 'https://discord.js.org',
        description: 'Your day of hell.',
        thumbnail: {
          url: 'https://data.axmag.com/images/icon_book.png',
        },
        fields: [
        ],
        timestamp: new Date(),
        footer: {
          text: 'Made with <3 by Sywren#0324',
        },
      };
      let id = false;
      let i = 0;
      pool.query(`SELECT userid FROM users;`, (err, res) => {
        while (i <= res.rows.length && res.rows.length != i) {
            if (res.rows[i].userid === message.author.id) {
              id = true
              console.log("User ID Already Exists In Database");
            }

        i = i + 1
      }
      if (id != true) {
          console.log("Adding User ID to Database...");
          pool.query(`
            INSERT INTO users(userid, username)
            VALUES(${message.author.id}, '${message.author.tag}')
            ;`)
          }

    })
      let x = 0;
      let present = false;
      if (args[0] === "update" && args[1] > 0 && args[1] < 10) {
        pool.query(`SELECT userid, classname, period FROM Schedule WHERE schedule.userid = ${message.author.id}`, (err, res) => {
          //Selects rows with userid same as message sender
          while (x <= res.rows.length && res.rows.length != x) {
            //console.log(x);
            if (res.rows[x].period === Number(args[1])) {
              pool.query(`UPDATE Schedule SET classname = '${args[2]}' WHERE schedule.userid = ${message.author.id} AND period = ${args[1]};`)
              present = true
              message.channel.send(`Updated Period ${args[1]} with ${args[2]} `)
            }
            x = x + 1
          }
          if (present === false) {
            pool.query(`INSERT INTO schedule(userid, period, classname) VALUES(${message.author.id}, ${args[1]}, '${args[2]}');`)
            //Inserts userid, period, and classname into schedule database
            message.channel.send(`Added Period ${args[1]} with ${args[2]} `)
            //returns notification of successful update
          }

      })

    }
    if (args[0] === undefined) {
      pool.query(`SELECT userid, classname, period from Schedule WHERE schedule.userid = ${message.author.id} ORDER BY period`, (err, res) => {
            console.log(res.rows.length);
          exampleEmbed.fields = [];
          for (var per = 0; per < res.rows.length; per++) {
            exampleEmbed.fields.push({name: `Period ${res.rows[per].period}`, value: `${res.rows[per].classname}`})
          }
          message.channel.send({embed: exampleEmbed})

      })
    }
  }
}
