import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, CardHeader, CardTitle, CardBody, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, ButtonGroup, Button, Alert, Progress } from 'reactstrap';
import FileReaderInput from 'react-file-reader-input';
import FontAwesome from 'react-fontawesome';

import cuid from 'cuid';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

if(process.env.NODE_ENV !== 'test') {
    var fileSaver = require('file-saver'); // eslint-disable-line
}

import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import Table from '../Table/Table';

class Importer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            content: '',
            delimiter: ';', // ; OR ,
            encoding: 'utf-8', // utf-8 OR ISO-8859-1 OR Windows-1252
            displayHelp: false,
            isParsing: true,
            isImporting: false,
            progressCount: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDownloadModel = this.handleDownloadModel.bind(this);

        this.renderActions = this.renderActions.bind(this);
    }

    getColumns() {
        return this.props.columns.sort((columnA, columnB) => columnA.index - columnB.index);
    }

    getItemData(item) {
        const itemToImport = {
            excludeFromImport: false,
            importId: cuid(),
        };
        let isFilled = false;
        this.props.columns.forEach(column => {
            if(item && item[column.index]) {
                itemToImport[column.property] = item[column.index];
                isFilled = true;
            }
        });
        return isFilled && itemToImport;
    }

    getItemsToImport() {
        return this.state.items.filter(item => !item.excludeFromImport);
    }

    handleChange(event, results) {
        results.forEach(result => {
            const [e, file] = result;
            let content = e.target.result;
            // console.log('original', content);
            const { encoding } = jschardet.detect(content);
            content = iconv.decode(content, encoding);
            // console.log('final', content);

            this.setState({
                content,
                isParsing: true,
            }, () => this.parseContent());
        });
    }

    parseContent() {
        let delimiter = this.state.delimiter;
        if(this.state.content.indexOf(delimiter) === -1) {
            delimiter = delimiter === ';' ? ',' : ';';
        }
        const items = [];
        const lines = this.state.content.split('\n');
        lines.filter(line => line).forEach(line => {
            items.push(line.split(delimiter).map(elt => elt.trim()));
        });

        // console.log(lines, items, delimiter, this.state.content);

        this.setState({
            items: items && items.map(item => this.getItemData(item)).filter(item => item),
            delimiter,
            isParsing: false,
        });
    }

    handleRemoveItem(event) {
        const idToRemove = event.target.value;
        this.setState({
            items: this.state.items.map((existingItem, index) => {
                if(existingItem.importId === idToRemove) {
                    return {
                        ...existingItem,
                        excludeFromImport: !event.target.checked,
                    };
                }
                return existingItem;
            }),
        });
    }

    handleSubmit() {
        if(this.state.items.length) {
            this.setState({
                isImporting: true,
            });
            const items = this.getItemsToImport().map(({ excludeFromImport, importId, ...item }) => item);
            this.props.handleImport(
                items,
                itemImported => {
                    this.setState({
                        progressCount: this.state.progressCount + 1,
                    });
                },
                (results, err) => {
                    this.setState({
                        isImporting: false,
                    });
                }
            );
        }
    }

    handleDownloadModel(event) {
        const fileName = 'import-model-csv.csv';
        const csvString = `${this.getColumns().map(column => column.property).join(',')}\n`;
        fileSaver.saveAs(new Blob([csvString], { type: 'text/csv;charset=utf-8' }), fileName); // eslint-disable-line
    }

    renderItemsToImport() {
        return <Table elements={this.state.items} columns={this.getColumns().filter(column => !column.hideOnImport)} renderActions={this.renderActions} disableCheck />;
    }

    renderActions(item, index) {
        return (
            <Toggle
                name="import"
                value={`${item.importId}`}
                checked={!item.excludeFromImport}
                onChange={this.handleRemoveItem}
            />
        );
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    {this.props.closeForm && <Button color="secondary" outline size="sm" onClick={this.props.closeForm} className="float-right"><FontAwesome name="chevron-left" /> <FormattedMessage id="close" defaultMessage="Close" /></Button>}
                    <CardTitle><FontAwesome name="file-upload" /> <FormattedMessage id="importerTitle" defaultMessage="Data import" /></CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        this.state.content
                        ?
                            this.state.items && this.state.items.length
                            ?
                                <div>
                                    <div className="text-center">
                                        <strong>{this.getItemsToImport().length} elements to import</strong><br />
                                        <ButtonGroup className="my-3">
                                            <Button color="secondary" onClick={() => this.setState({ items: [], content: '' })}><FontAwesome name="undo" /> <FormattedMessage id="retry" defaultMessage="Retry" /></Button>
                                            <Button color="info" onClick={() => this.handleSubmit()} disabled={this.state.isImporting}><FontAwesome name="file-upload" /> <FormattedMessage id="save" defaultMessage="Save" /></Button>
                                        </ButtonGroup>
                                        {this.state.isImporting ? <Progress color="success" value={this.state.progressCount * 100 / (this.state.items || ['']).length} animated /> : null}
                                    </div>
                                    {this.renderItemsToImport()}
                                </div>
                            :
                                <Alert color="warning" className="text-center">
                                    <FontAwesome name="exclamation-triangle" /> <FormattedMessage id="importerNoItemsAlert" defaultMessage="No items to import" />
                                </Alert>
                        :
                            <FormGroup className="text-center">
                                <p>
                                    <FontAwesome name="info-circle" /> <FormattedMessage id="importerFileInfo" defaultMessage="Select a CSV file (Coma Separated Value)" /><br />
                                    <small><FormattedMessage id="importerFileHelp" defaultMessage="You can generate a csv file with your spreadsheet programm (Excel, OpenOffice, ...)" /></small>
                                </p>
                                <ButtonGroup>
                                    <FileReaderInput as="binary" onChange={this.handleChange} accept=".csv">
                                        <Button color="info"><FontAwesome name="file-upload" /> <FormattedMessage id="selectFile" defaultMessage="Select a file" /></Button>
                                    </FileReaderInput>
                                    <Button color="secondary" outline onClick={event => this.setState({ displayHelp: true })}><FontAwesome name="question-circle" /> <FormattedMessage id="help" defaultMessage="Help" /></Button>
                                </ButtonGroup>
                            </FormGroup>
                    }

                    {
                        this.state.displayHelp
                        ?
                            <div>
                                <dl className="row">
                                    {this.getColumns().map((column, index) =>
                                        <Fragment key={index} >
                                            <dt className="col-3 text-right">
                                                <strong>{column.property}</strong>
                                            </dt>
                                            <dd className="col-9 mb-2">
                                                {column.label} <br />
                                                Position: {index + 1}<br />
                                                <em>{column.description || ''}</em>
                                            </dd>
                                        </Fragment>
                                    )}
                                </dl>
                                <div className="text-center my-3">
                                    <Button color="primary" outline onClick={this.handleDownloadModel}><FontAwesome name="file-download" /> <FormattedMessage id="importModelDownloadButton" defaultMessage="Download model file" /></Button>
                                </div>
                            </div>
                        : null
                    }
                </CardBody>
            </Card>
        );
    }
}

Importer.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleImport: PropTypes.func.isRequired,
    closeForm: PropTypes.func,
};

export default injectIntl(Importer);
