const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const Pool = require('pg').Pool
const pool = new Pool({ user: 'admin', host: 
	'localhost', database: 'poleconydb', password: '1234', port: 5432,
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is working!')
})


app.get('/appointment', (req, res) => {	
	var accountID = req.query.accountID;
	var type = req.query.type;

	if(type == 'caregiver'){
		pool.query('SELECT accounts.firstname, accounts.lastname, visits.date, visits.hour, visits.duration, service_address.address, visits.price, visits.currency, visits.ServiceListID FROM visits, accounts, service_address WHERE visits.caregiverid IS NOT NULL AND visits.seniorid = accountid AND service_address.serviceaddressid = visits.serviceaddressid AND visits.caregiverid = ' + accountID, (error, results)=>{
			if(error) {
				console.log(error)
				res.status(200).json({'error': 'SQL error'})
				}
			else{
				res.status(200).json({visits: results.rows})
			}
		})
	}
	else if(type == 'senior'){
		pool.query('SELECT accounts.firstname, accounts.lastname, visits.date, visits.hour, visits.duration, service_address.address, visits.price, visits.currency, visits.ServiceListID FROM visits, accounts, service_address WHERE visits.caregiverid IS NOT NULL AND visits.caregiverid = accountid AND service_address.serviceaddressid = visits.serviceaddressid AND visits.seniorid =' + accountID, (error, results)=>{
			if(error) {
				console.log(error)
				res.status(200).json({'error': 'SQL error'})
				}
			else{
				res.status(200).json({visits: results.rows})
			}
		})
	}
	else{
		res.status(200).json({error: 'invalid type'})
	}
})

app.get('/services', (req, res) => {	
	var ServiceListID = req.query.servicelistid;
	pool.query('Select services.servicename from service_list, services where services.serviceID = service_list.serviceID and service_list.servicelistID = ' + ServiceListID, (error, results)=>{
	if(error) {
		console.log(error)
		res.status(200).json({'error': 'SQL error'})
	}
	else{
	res.status(200).json({service_list: results.rows})
	}
	})
})

app.get('/matching', (req, res) => {	
	pool.query('select visits.visitid, firstname, lastname, visits.date, visits.hour, visits.duration, service_address.address, visits.price, visits.currency, visits.ServiceListID from service_address, visits INNER JOIN accounts ON visits.seniorid = accounts.accountid OR visits.caregiverid = accounts.accountid WHERE visits.caregiverid IS NULL', (error, results)=>{
	if(error) {
		console.log(error)
		res.status(200).json({'error': 'SQL error'})
	}
	else{
	res.status(200).json({available_visits: results.rows})
	}
	})
})

app.get('/submit_caregiver', (req, res) => {
	var visitID = parseInt(req.query.visitID);
	var caregiverID = parseInt(req.query.caregiverID);
	pool.query('UPDATE visits SET caregiverID = '+ caregiverID +' WHERE visitID ='+ visitID, (error, results)=>{
	if(error) {
		console.log(error)
		res.status(200).json({'error': 'SQL error'})
	}
	else{
	res.status(200).json({'visitID': visitID, 'caregiverID': caregiverID})
	}
	})
})

app.post('/create_visit', (req, res) => {
	var accountID = parseInt(req.body.accountID);
	var date = req.body.date;
	var hour = req.body.hour;
	var duration = parseInt(req.body.duration);
	var localization = req.body.localization;
	var services = req.body.services;

	var price = parseInt(req.body.price);
	var currency = req.body.currency;

	console.log('Received data:')
	console.log(accountID)
	console.log(date)
	console.log(hour)
	console.log(duration)
	console.log(localization)
	console.log(services)
	console.log(price)
	console.log(currency)

	/// INSERT INTO service_address (Senior, address) VALUES (accountID, localization);
	pool.query('INSERT INTO service_address (Senior, Address) VALUES (9,"'+localization+'")', (error, results)=>{
		if(error){
			console.log(error)
			res.status(200).json({'SQL error': 'INSERT INTO service_address'})
		}
		else{
			console.log({'INSERT INTO service_address': 'complete'})
			/// INSERT INTO service_list (ServiceID) VALUES (val)
			for (let val of services){
				pool.query('INSERT INTO service_list (ServiceID) VALUES ('+val+')',(error, results)=>{
					if(error){
						console.log(error)
						res.status(200).json({'SQL error': 'INSERT INTO service_list'})
					}
					else{
						console.log({'INSERT INTO service_list': 'complete'})
						/// INSERT INTO visits (SeniorID, BookingPersonID, Date, Hour, Duration, DateAndTimeOfRequest, ServiceAddressID, ServiceListID, Price, Currency) VALUES (accountID, accountID, date, hour, duration, GETDATE(),MAX(service_address.ServiceAddressID), MAX(service_list.ServiceListID), price, currency)
						pool.query('INSERT INTO visits (SeniorID, BookingPersonID, Date, Hour, Duration, DateAndTimeOfRequest, ServiceAddressID, ServiceListID, Price, Currency) VALUES ('+accountID, accountID, date, hour, duration, GETDATE(), MAX(service_address.ServiceAddressID), MAX(service_list.ServiceListID), price, currency+')',(error, results)=>{
							if(error){
								console.log(error)
								res.status(200).json({'SQL error': 'INSERT INTO visits'})
							}
							else{
								res.status(200).json({'INSERT INTO visits': 'complete'})
							}
						})
					}
				})
			}
		}
	})
})



app.listen(port, () => { console.log('App is running')})
