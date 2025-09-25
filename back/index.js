

const app = require("./src/server");
const port = 3001
const connectDB = require("./src/config/conDb");

connectDB().then(()=>{
    app.listen(port, ()=> {
        console.log("Servidor escuchando en el puerto", port )
    } )
})
