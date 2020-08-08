import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'reactstrap';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = require('./client_secret.json');

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1Efe8VpmvHhnTunxeq2A6LdE1jk8kDCELnSIhWA4rTAY');

const tableBody = document.getElementById('tableData');
let dataHtml = '';
let sheet = '';
let rows = '';
let sortDirection = false;

let worksData = [];
let worksDataSearch = [];

async function accessSpreadsheet(){
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);


  sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  rows = await sheet.getRows();


  console.log(sheet.title);
  console.log(sheet.rowCount);

  for (var i = 0; (i + 1) < sheet.rowCount; i++) {
    worksData.push({
    author: rows[i].author,
    title: rows[i].title,
    edition: rows[i].edition,
    city: rows[i].city,
    company: rows[i].company,
    year: rows[i].year,
    pages: rows[i].pages,
    url: rows[i].url
    })
  }

loadTableData(worksData);

}

function loadTableData(worksData) {
  //accessSpreadsheet();
  const tableBody = document.getElementById('tableData');
  let dataHtml = '';

  for (var i = 0; i < worksData.length; i++) {
    dataHtml += `<tr><td>${worksData[i].author}</td><td>${worksData[i].title}</td><td><a href="${worksData[i].url}" target="_blank">${worksData[i].url}</td></a><td></td><td></td></tr>`;
  }
  //console.log(dataHtml);

  tableBody.innerHTML = dataHtml;
}

console.log(worksData);

accessSpreadsheet();


function sortColumn(columnName) {
  const dataType = typeof worksData[0][columnName];
  // console.log(dataType);

  sortDirection = !sortDirection;

  switch (dataType) {
    case 'number':
      sortNumberColumn(sortDirection, columnName);
      break;
    case 'string':
      sortTextColumn(sortDirection, columnName);
      break;
  }
  loadTableData(worksData);
}

function sortNumberColumn(sort, columnName) {
  worksData = worksData.sort((p1, p2) => {
    return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName]
  });

}

function sortTextColumn(sort, columnName) {
  worksData = worksData.sort((p1, p2) => {
    return sort ? (p1[columnName] > p2[columnName]) - (p1[columnName] < p2[columnName]) : (p2[columnName] > p1[columnName]) - (p2[columnName] < p1[columnName])
  });
}

function search() {
  loadTableData(worksData);
  let term = document.getElementById("term").value;
  //let option = document.getElementById("option").value;

  if (document.getElementById('option1').checked) {
    for (var i = 0; i < worksData.length; i++) {
      if (worksData[i].author.search(term) != -1) {
        worksDataSearch.push({
          author: worksData[i].author,
          title: worksData[i].title,
          edition: worksData[i].edition,
          city: worksData[i].city,
          company: worksData[i].company,
          year: worksData[i].year,
          pages: worksData[i].pages,
          url: worksData[i].url
        })
      }
    }
    // console.log(require('electron').remote.getGlobal('Result')[i].author);

    loadTableData(worksDataSearch);
    worksDataSearch = [];

  }else if (document.getElementById('option2').checked) {
    for (var i = 0; i < worksData.length; i++) {
      if (worksData[i].title.search(term) != -1) {
        worksDataSearch.push({
          author: worksData[i].author,
          title: worksData[i].title,
          edition: worksData[i].edition,
          city: worksData[i].city,
          company: worksData[i].company,
          year: worksData[i].year,
          pages: worksData[i].pages,
          url: worksData[i].url
        })
      }
    }
    // console.log(require('electron').remote.getGlobal('Result')[i].author);

    loadTableData(worksDataSearch);
    worksDataSearch = [];


  }else {
    alert("Nenhuma opção selecionada");
  }

}

function App() {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div>
      <p className="h1" align="center">TECNOLOGIAS PARA DOCÊNCIA</p>
      <Form inline>
        <FormGroup className="col-3">
          <Label className="col-5">Tipo de obra</Label>
          <Input type="select" name="select" id="exampleSelect">
            <option>Livro</option>
            <option>Evento</option>
            <option>Periódico</option>
            <option>Tese</option>
            <option>Dissertação</option>
            <option>Monografia</option>
            <option>Outros</option>
            <option>Todos</option>
          </Input>
        </FormGroup>

        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input type="Text" name="term" id="term" placeholder="Termo de pesquisa" />
        </FormGroup>

        <FormGroup className="col-3">
          <FormGroup className="col-3">
            <Label check>
            <Input type="radio" name="option" id="option1"/>{' '}
              Autor
              </Label>
          </FormGroup>

          <FormGroup className="col-3">
            <Label check>
            <Input type="radio" name="option" id="option2"/>{' '}
              Título
            </Label>
          </FormGroup>

        </FormGroup>



        <Button onClick={() => search()}>Pesquisar</Button>
      </Form>



      <Table striped bordered hover className="table table-sortable">
        <thead>
          <tr>
            <th onClick={() => sortColumn('author')}>Autor</th>
            <th onClick={() => sortColumn('title')}>Título</th>
            <th>URL</th>
            <th>Fichamento</th>
            <th>Metadados</th>
          </tr>
        </thead>

        <tbody id="tableData">
        </tbody>
      </Table>

    </div>
  );
}

export default App;
