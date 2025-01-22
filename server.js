const express=require('express');
const bodyParser=require('body-parser');
const {Sequelize, DataTypes}=require('sequelize');


const app=express();
app.use(bodyParser.json());

const sequelize=new Sequelize('sqlite::memory:');

const Employee=sequelize.define('Employee', {
    EmployeeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Salary: {
        type: DataTypes.DECIMAL,
        allowNull: true
    }
}, {
    timestamps: false
});

sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.error('Error initializing database:', err));


app.post('/api/employees', async (req, res) => {
    try {
        const employee=await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/api/employees', async (req, res) => {
    try {
        const employees=await Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/employees/:id', async (req, res) => {
    try{
        const employee=await Employee.findByPk(req.params.id);
        if(employee){
            res.status(200).json(employee);
        }else{
            res.status(404).json({ error: 'Employee not found' });
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});


app.put('/api/employees/:id', async (req, res) => {
    try{
        const employee=await Employee.findByPk(req.params.id);
        if(employee) {
            await employee.update(req.body);
            res.status(200).json(employee);
        }else{
            res.status(404).json({ error: 'Employee not found' });
        }
    }catch(error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Employee
app.delete('/api/employees/:id', async (req, res) => {
    try{
        const employee=await Employee.findByPk(req.params.id);
        if(employee){
            await employee.destroy();
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
