const sql = require('mssql');

const config253 = {
  user: 'sa',
  password: 'hxrt',
  server: '192.168.100.253',
  database: 'HZNewDB'
};

var pool253 = new sql.ConnectionPool(config253, err => {});


var express = require('express')
var app = express();
var logger = require('morgan');
app.use(logger('common'));
var methodOverride = require('method-override');
app.use(methodOverride());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});


//const sqlstring = 'select DISTINCT TB_CR_Customer.Customer_dId as wsn, convert(varchar(20), TB_CR_Customer.Customer_dCheckDate, 23) as date, PLC.dbo.ZZ_PdfOnCloudLog.subject as subject from TB_CR_Customer,PLC.dbo.ZZ_PdfOnCloudLog where TB_CR_Customer.Customer_sIdNumber=@id and TB_CR_Customer.Customer_dId = PLC.dbo.ZZ_PdfOnCloudLog.wkst order by TB_CR_Customer.Customer_dId DESC';
sql_carousel = 'select uid,title from ZZ_Bulletin where state = 2';
sql_summary = 'select uid,title,issuedate from ZZ_Bulletin where state > 0';
sql_detail = 'select title,body,issuedate,issuer from ZZ_Bulletin where uid=@id';

app.get('/api/v1/bulletin/carousel', function(req, res) {
    pool253.request().query(sql_carousel, (err, result)=>{
		if(!err){
		  res.status(200).json({status:{code:0,description:'成功'},data:result.recordset});
		} else {
		  res.status(200).json({status:{code:1,description:'失败'}});
		}
	});
});


app.get('/api/v1/bulletin/summary', function(req, res) {
    pool253.request().query(sql_summary, (err, result)=>{
		if(!err){
		  res.status(200).json({status:{code:0,description:'成功'},data:result.recordset});
		} else {
		  res.status(200).json({status:{code:1,description:'失败'}});
		}
	});
});


app.get('/api/v1/bulletin/:id/detail', function(req, res) {
	var id = req.params.id || '';
	pool253.request().input('id', id).query(sql_detail, (err, result)=>{
		if(!err){
			res.status(200).json({status:{code:0,description:'成功'},data:result.recordset});
		} else {
			res.status(200).json({status:{code:1,description:'失败'}});
		}
	});
});


app.use(function(req, res, next){
    console.log(req.headers);
    console.log(req.body);
    res.status(200).json({status:"???"});
});

var server = app.listen(8085, "0.0.0.0", function() {
   console.log('listening on port %d', server.address().port);
});

