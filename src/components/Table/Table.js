import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Col, Table as BootstrapTable, Card, CardHeader, CardTitle, CardBody, FormGroup, FormText, Label, InputGroup, InputGroupAddon, InputGroupText, Input, ButtonGroup, Button, Pagination, PaginationItem, PaginationLink, Alert, UncontrolledTooltip } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

import DatePicker from 'react-datepicker';

import moment from 'moment';
if(process.env.NODE_ENV !== 'test') {
    var fileSaver = require('file-saver'); // eslint-disable-line
}

import Importer from '../Importer/Importer';

import { displayErrors } from '../../modules/Error/ErrorActions';

import 'react-datepicker/dist/react-datepicker.css';


class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayPager: typeof props.displayPager !== 'undefined' ? props.displayPager : true,
            displaySearchInput: typeof props.displaySearchInput !== 'undefined' ? props.displaySearchInput : true,
            searchText: props.searchText || (props.table && props.table.searchText) || '',
            searchColum: props.columns.filter(column => column.searchable !== null || column.searchable),
            searchFilters: props.searchFilters || (props.table && props.table.searchFilters) || [],
            sortColumn: props.columns && props.columns.length ? (props.columns.find(column => column.sort) || props.columns[0]) : {},
            sortType: props.columns && props.columns.length && props.columns.find(column => column.sort) ? props.columns.find(column => column.sort).sort : 'ASC', // || DESC
            elements: props.elements || [],
            activePage: (props.table && props.table.activePage) || 1,
            pageSize: (props.table && props.table.pageSize) || 10,
            pagerSize: props.pagerSize || 20,
            isRefreshing: false,
            selection: [],
            selectAll: false,
            massAction: { id: '' },
            displayImporter: false,
        };

        this.getCelValue = this.getCelValue.bind(this);
        this.getCelDisplay = this.getCelDisplay.bind(this);
        this.getSearchedElements = this.getSearchedElements.bind(this);
        this.getSearchedPages = this.getSearchedPages.bind(this);

        this.sortElements = this.sortElements.bind(this);

        this.renderHeaders = this.renderHeaders.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.renderRowSelection = this.renderRowSelection.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderRowAction = this.renderRowAction.bind(this);

        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClearSearch = this.handleClearSearch.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.setActivePage = this.setActivePage.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handlePageSizeSwitch = this.handlePageSizeSwitch.bind(this);
        this.handleDownloadCsvData = this.handleDownloadCsvData.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleImport = this.handleImport.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.elements !== this.props.elements) {
            this.setState({
                elements: this.props.elements,
            });
        }
        const searchedPages = this.getSearchedPages(this.getSearchedElements());
        if(searchedPages.length && searchedPages.length < this.state.activePage) {
            this.setState({
                activePage: 1,
            });
        }
    }

    componentWillUnmount() {
        this.updateTableData();
    }

    getElementIdentifier() {
        return this.props.elementIdentifier || '_id';
    }

    getCelValue(element, column) {
        let value = '';
        if(element && column.property && element[column.property]) {
            value = element[column.property];
            if(typeof element[column.property].value !== 'undefined') {
                value = element[column.property].value;
            }
        }
        return value;
    }

    getCelDisplay(element, column) {
        if(element[column.property] && typeof element[column.property].display !== 'undefined') {
            return element[column.property].display;
        } else if(typeof element[column.property] !== 'undefined') {
            return element[column.property];
        }
        return '';
    }

    getSearchedElements() {
        return this.state.elements
            // Filter by search text first
            .filter(element => this.state.searchColum.some(column => {
                if(this.state.searchText) {
                    const valueToCompare = this.getCelValue(element, column);
                    if(valueToCompare && typeof valueToCompare === 'string' && valueToCompare.toString().toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1) {
                        return element;
                    } else if(valueToCompare && Array.isArray(valueToCompare) && valueToCompare.some(val => val.toString().toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1)) {
                        return element;
                    }
                    return false;
                }
                return element;
            }))
            // Filter by side filters after
            .filter(element =>
                !this.state.searchFilters.length
                || this.state.searchFilters.every(filter => {
                    const elementValue = this.getCelValue(element, filter);
                    // console.log(elementValue[this.getElementIdentifier()], elementValue, filter);
                    if(elementValue[this.getElementIdentifier()]) {
                        return this.compareFilterWithValue(elementValue[this.getElementIdentifier()], filter);
                    }
                    if(Array.isArray(elementValue)) {
                        return elementValue.includes(filter.value);
                    }
                    return this.compareFilterWithValue(elementValue, filter);
                })
            )
            .sort(this.sortElements);
    }

    compareFilterWithValue(value, filter) {
        switch(filter.type) {
            case 'date':
                // console.log('Value transform', value, moment(value).format('x'));
                value = moment(value).format('x'); // timestamp in ms
                break;

            case 'text':
                if(typeof value === 'string') {
                    return value.toLowerCase().includes(filter.value.toLowerCase());
                }
                break;

            default:
                break;
        }
        // console.log(`${value} ${filter.compareSign} ${filter.value} ? `);

        switch(filter.compareSign) {
            case '>=':
            case '>':
                return value >= filter.value;

            case '<':
            case '<=':
                return value <= filter.value;

            case '=':
            default:
                return value === filter.value;
        }
    }

    sortElements(elementA, elementB) {
        let elementAValue = this.getCelValue(elementA, this.state.sortColumn);
        let elementBValue = this.getCelValue(elementB, this.state.sortColumn);

        if(Array.isArray(elementAValue)) {
            elementAValue = `${elementAValue.length}`;
        }
        if(Array.isArray(elementBValue)) {
            elementBValue = `${elementBValue.length}`;
        }

        let compareValue = 0;
        if(elementAValue.localeCompare) {
            compareValue = elementAValue.localeCompare(elementBValue, this.props.intl.locale, { ignorePunctuation: true });
        } else {
            if(elementAValue > elementBValue) {
                compareValue = 1;
            } else if(elementAValue < elementBValue) {
                compareValue = -1;
            } else {
                compareValue = 0;
            }
        }

        return this.state.sortType === 'DESC' ? -compareValue : compareValue;
    }

    getSearchedPages(searchedElements) {
        const pages = [];
        if(searchedElements) {
            const pagesCount = Math.ceil(searchedElements.length / this.state.pageSize);
            for(let i = 1; i <= pagesCount; i++) {
                pages.push(i);
            }
        }
        return pages;
    }

    hasFilters() {
        return this.props.filters && this.props.filters.length;
    }

    getFilterValue(property) {
        const searchFilter = this.state.searchFilters.length
            ? this.state.searchFilters.find(searchFilter => { return searchFilter.subProperty ? searchFilter.subProperty === property : searchFilter.property === property; })
            : null;
        return searchFilter ? searchFilter.value : '';
    }

    getTotalColumnsCount() {
        return this.props.columns.length + 2;
    }

    setActivePage(event, nextPage) {
        event.preventDefault();
        this.setState({
            activePage: nextPage,
        });
    }

    handleSearch(event) {
        this.setState({
            searchText: event.target.value,
            activePage: 1,
        });
    }

    handleClearSearch() {
        this.setState({
            searchText: '',
        });
    }

    handleSort(column, type = null) {
        if(type === null) {
            if(this.state.sortColumn && this.state.sortColumn.property === column.property) {
                type = this.state.sortType === 'ASC' ? 'DESC' : 'ASC';
            }
        }
        this.setState({
            sortColumn: column,
            sortType: type,
        });
    }

    handleFilter(event, specs = {}) {
        const compareFilterName = specs.subProperty || event.target.name;
        const newSearchFilters = this.state.searchFilters.filter(filter => { return filter.subProperty ? filter.subProperty !== compareFilterName : filter.property !== compareFilterName; });
        if(event.target.value) {
            // console.log('date value ', event.target.value, typeof event.target.value);
            newSearchFilters.push({
                ...specs,
                property: event.target.name,
                value: event.target.value,
            });
        }
        this.setState({
            searchFilters: newSearchFilters,
        });
    }

    handleRefresh(event) {
        event.preventDefault();

        this.setState({
            isRefreshing: true,
        });

        this.props.refresh().then(items => {
            this.setState({
                isRefreshing: false,
            });
            if(items || Object.keys(items)) {
                displayErrors('success', this.props.intl.formatMessage({ id: 'tableRefreshSuccessAlert', defaultMessage: 'Synchronized!' }));
            } else {
                console.error(items);
                displayErrors('error', this.props.intl.formatMessage({ id: 'tableRefreshSuccessError', defaultMessage: 'Error synchronizing!' }));
            }
        }).catch(err => {
            this.setState({
                isRefreshing: false,
            });
            console.error(err);
            displayErrors('error', this.props.intl.formatMessage({ id: 'tableRefreshSuccessError', defaultMessage: 'Error synchronizing!' }));
        });
    }

    handleImport(items, onImportItemSuccess = () => {}) {
        this.props.import(items, onImportItemSuccess).then(items => {
            displayErrors('success', this.props.intl.formatMessage({
                id: 'importRequestSuccess',
                defaultMessage: 'Data imported!',
            }));
            this.setState({
                displayImporter: false,
            });
        }).catch(err => {
            console.error(err);
            displayErrors('error', this.props.intl.formatMessage({
                id: 'importRequestError',
                defaultMessage: 'Error on import!',
            }));
        });
    }

    handlePageSizeSwitch(event) {
        this.setState({
            pageSize: event.target.value,
        });
    }

    handleDownloadCsvData() {
        const elements = this.state.selection && this.state.selection.length ? this.state.selection : this.getSearchedElements();
        if(elements && elements.length) {
            const csvData = [];
            const header = this.props.columns.map(column => column.property);
            csvData.push(header);
            elements.forEach(element => {
                const line = [];
                this.props.columns.forEach(column => {
                    line.push(this.getCelValue(element, column).toString().replace(/,/g, ';'));
                });
                csvData.push(line);
            });
            const fileName = `${this.props.id ? `${this.props.id}-` : ''}csv-datas.csv`;
            const csvString = csvData.map(line => line.join(',')).join('\n');
            fileSaver.saveAs(new Blob([csvString], { type: 'text/csv;charset=utf-8' }), fileName); // eslint-disable-line
        } else {
            displayErrors('warning', this.props.intl.formatMessage({ id: 'tableDownloadNoElementError', defaultMessage: 'No elements to download !' }));
        }
    }

    handleSelection(event, element) {
        if(!this.props.disableCheck) {
            if(event.target.checked) {
                this.setState({
                    selection: [
                        ...this.state.selection,
                        element,
                    ],
                });
            } else {
                this.setState({
                    selection: this.state.selection.filter(selected => selected[this.getElementIdentifier()] !== element[this.getElementIdentifier()]),
                });
            }
        }
    }

    handleSelectAll(event) {
        this.setState({
            selectAll: event.target.checked,
            selection: event.target.checked ? this.getSearchedElements() : [],
        });
    }

    updateTableData() {
        this.props.update && this.props.update({
            activePage: this.state.activePage,
            pageSize: this.state.pageSize,
            searchText: this.state.searchText,
            searchFilters: this.state.searchFilters,
        });
    }

    renderSearch() {
        return (
            this.state.displaySearchInput
            ?
                <CardHeader>
                    <InputGroup size="sm" className="">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText className={this.state.searchText && 'bg-warning text-white'}>
                                {
                                    this.state.searchText !== ''
                                    ? <FontAwesome name="times-circle" size="lg" fixedWidth onClick={this.handleClearSearch} />
                                    : <FontAwesome name="search" size="lg" fixedWidth />
                                }
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="search" bsSize="sm" value={this.state.searchText || ''} onChange={this.handleSearch} placeholder={this.props.intl.formatMessage({ id: 'searchFor', defaultMessage: 'Search for' })} />
                        <InputGroupAddon addonType="append">
                            <Button color="dark" size="sm" outline id={`tableDownloadButton-${this.props.id}`} onClick={() => this.handleDownloadCsvData()}><FontAwesome name="download" fixedWidth /></Button>
                            <UncontrolledTooltip target={`tableDownloadButton-${this.props.id}`}>
                                <FormattedMessage id="download" defaultMessage="Download" />
                            </UncontrolledTooltip>
                        </InputGroupAddon>
                        {
                            this.props.import
                            ?
                                <InputGroupAddon addonType="append">
                                    <Button color="dark" size="sm" outline id={`tableImportButton-${this.props.id}`} onClick={event => this.setState({ displayImporter: !this.state.displayImporter })}>{this.state.displayImporter ? <FontAwesome name="times" fixedWidth /> : <FontAwesome name="file-upload" fixedWidth />}</Button>
                                    <UncontrolledTooltip target={`tableImportButton-${this.props.id}`}>
                                        <FormattedMessage id="import" defaultMessage="Import" />
                                    </UncontrolledTooltip>
                                </InputGroupAddon>
                            : null
                        }
                        {
                            this.props.refresh
                            ?
                                <InputGroupAddon addonType="append">
                                    <Button color="info" size="sm" id={`tableRefreshButton-${this.props.id}`} onClick={this.handleRefresh} disabled={this.state.isRefreshing}><FontAwesome name="sync-alt" fixedWidth spin={this.state.isRefreshing} /></Button>
                                    <UncontrolledTooltip target={`tableRefreshButton-${this.props.id}`}>
                                        <FormattedMessage id="refresh" defaultMessage="Refresh" />
                                    </UncontrolledTooltip>
                                </InputGroupAddon>
                            : null
                        }
                    </InputGroup>
                </CardHeader>
            : null
        );
    }

    renderFilters() {
        if(this.props.filters) {
            return (
                <Card className="shadow mb-3">
                    <CardHeader>
                        <CardTitle><FontAwesome name="filter" /><FormattedMessage id="filtersTitle" defaultMessage="Filters" /></CardTitle>
                    </CardHeader>
                    <CardBody>
                        {this.props.filters.map((filter, index) => {
                            switch(filter.type) {

                                case 'checkbox':
                                    return ''; // TODO: Display toggler with values for (un)checked box

                                case 'date': {
                                    const defaultOptions = {
                                        range: 'between',
                                    };
                                    const options = { ...defaultOptions, ...filter.options };
                                    return (
                                        <FormGroup key={index}>
                                            <Label>{filter.label}</Label>
                                            <Row>
                                                {
                                                    options.range !== 'end'
                                                    ?
                                                        <Col>
                                                            {this.getFilterValue(`${filter.property}Start`) ? <Button color="danger" outline size="sm" style={{ position: 'absolute', top: 0, right: 0, zIndex: 5 }} onClick={event => this.handleFilter({ ...event, target: { ...event.target, name: filter.property } }, { subProperty: `${filter.property}Start` })}><FontAwesome name="times-circle" /></Button> : null}
                                                            <DatePicker
                                                              name={filter.property}
                                                              id={`${filter.property}StartField`}
                                                              className="form-control form-control-sm"
                                                              selected={this.getFilterValue(`${filter.property}Start`) || null}
                                                              onChange={date => this.handleFilter({ target: { name: filter.property, value: date } }, { ...filter, subProperty: `${filter.property}Start`, compareSign: '>=' })}
                                                              maxDate={this.getFilterValue(`${filter.property}End`) || null}
                                                              dateFormat="dd/MM/yyyy"
                                                              utcOffset={0}
                                                              shouldCloseOnSelect
                                                              placeholderText={this.props.intl.formatMessage({ id: 'dateSelect', defaultMessage: 'Select a date' })}
                                                              autoComplete="off"
                                                            />
                                                        </Col>
                                                    : null
                                                }
                                                {
                                                    options.range !== 'start'
                                                    ?
                                                        <Col>
                                                            {this.getFilterValue(`${filter.property}End`) ? <Button color="danger" outline size="sm" style={{ position: 'absolute', top: 0, right: 0, zIndex: 5 }} onClick={event => this.handleFilter({ ...event, target: { ...event.target, name: filter.property } }, { subProperty: `${filter.property}End` })}><FontAwesome name="times-circle" /></Button> : null}
                                                            <DatePicker
                                                              name={`${filter.property}`}
                                                              id={`${filter.property}EndField`}
                                                              className="form-control form-control-sm"
                                                              selected={this.getFilterValue(`${filter.property}End`) || null}
                                                              onChange={date => this.handleFilter({ target: { name: filter.property, value: moment(date).hours(23).minutes(59).seconds(59).toDate() } }, { ...filter, subProperty: `${filter.property}End`, compareSign: '<=' })}
                                                              minDate={this.getFilterValue(`${filter.property}Start`) || null}
                                                              dateFormat="dd/MM/yyyy"
                                                              utcOffset={0}
                                                              shouldCloseOnSelect
                                                              placeholderText={this.props.intl.formatMessage({ id: 'dateSelect', defaultMessage: 'Select a date' })}
                                                              autoComplete="off"
                                                            />
                                                            {options.range === 'end' ? <FormText><FormattedMessage id="dateSelectEndInfo" defaultMessage="This value will be applied as maximum (included)" /></FormText> : null}
                                                        </Col>
                                                    : null
                                                }
                                            </Row>
                                        </FormGroup>
                                    );
                                }

                                case 'select': {
                                        let options = [];
                                        if(filter.options) {
                                            options = filter.options;
                                        } else {
                                            this.props.elements.forEach(element => {
                                                const optionValue = this.getCelValue(element, filter);
                                                const optionDisplay = this.getCelDisplay(element, filter);
                                                if(optionValue) {
                                                    if(Array.isArray(optionValue)) {
                                                        optionValue.forEach(opt => {
                                                            if(!options.find(option => option.value === opt)) {
                                                                options.push({
                                                                    value: opt,
                                                                    display: opt,
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        if(!options.find(option => option.value === optionValue)) {
                                                            options.push({
                                                                value: optionValue,
                                                                display: optionDisplay,
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        return (
                                            <FormGroup key={index}>
                                                <Label>{filter.label}</Label>
                                                <InputGroup size="sm">
                                                    <Input type="select" name={filter.property} onChange={event => this.handleFilter(event, filter)} value={this.getFilterValue(filter.property)}>
                                                        <FormattedMessage id="selectOptions" defaultMessage="Select an option" >
                                                            {message => <option value="">{message}</option>}
                                                        </FormattedMessage>
                                                        {options.filter(option => option).map((option, index) => <option key={index} value={option.value[this.getElementIdentifier()] || option.value}>{option.value}</option>)}
                                                    </Input>
                                                    {this.getFilterValue(filter.property) ? <InputGroupAddon addonType="append"><Button color="danger" outline onClick={event => this.handleFilter({ ...event, target: { ...event.target, name: filter.property } })}><FontAwesome name="times-circle" /></Button></InputGroupAddon> : null}
                                                </InputGroup>
                                            </FormGroup>
                                        );
                                    }

                                default:
                                    return (
                                        <FormGroup key={index}>
                                            <Label>{filter.label}</Label>
                                            <InputGroup>
                                                <Input type="text" bsSize="sm" name={filter.property} onChange={event => this.handleFilter(event, filter)} value={this.getFilterValue(filter.property)} />
                                                {this.getFilterValue(filter.property) ? <InputGroupAddon addonType="append"><Button color="danger" outline onClick={event => this.handleFilter({ ...event, target: { ...event.target, name: filter.property } })}><FontAwesome name="times-circle" /></Button></InputGroupAddon> : null}
                                            </InputGroup>
                                        </FormGroup>
                                    );
                            }
                        })}
                    </CardBody>
                </Card>
            );
        }
    }


    renderHeaders() {
        const attributeColumns = this.props.columns ? this.props.columns.map((column, index) => <th key={index} onClick={event => this.handleSort(column)}>{column.label}{this.renderSorter(column)}</th>) : '';
        const actionsColumn = this.props.renderActions ? <th className="text-right"><FormattedMessage id="actions" defaultMessage="Actions" /></th> : '';
        return (
            <thead>
                <tr>
                    {!this.props.disableCheck && this.props.massActions && this.props.massActions.length ? <th><input type="checkbox" name="selectAll" checked={this.state.selectAll || false} onChange={this.handleSelectAll} /></th> : null}
                    {attributeColumns}
                    {actionsColumn}
                </tr>
            </thead>
        );
    }

    renderSorter(column) {
        if((this.props.excludeSortColumns && this.props.excludeSortColumns.includes(column.property)) || this.props.includeSortColumns && !this.props.includeSortColumns.includes(column.property)) {
            return '';
        }

        const { sortColumn, sortType } = this.state;
        if(sortColumn && sortColumn.property === column.property) {
            return <span className="ml-2">{sortType === 'ASC' ? <FontAwesome name="caret-up" /> : <FontAwesome name="caret-down" />}</span>;
        }
            // <ButtonGroup vertical size="sm" className="ml-2">
            //     {['ASC', 'DESC'].map((type, index) => <Button key={index} color="secondary" outline className={`m-0 p-0 border-0 ${sortColumn.property === column.property && sortType === type ? 'text-white' : ''}`} onClick={event => this.handleSort(column, type)}>{type === 'ASC' ? <FontAwesome name="caret-up" /> : <FontAwesome name="caret-down" />}</Button>)}
            // </ButtonGroup>
    }

    renderRows(elements) {
        if(elements && elements.length) {
            const min = this.state.displayPager ? this.state.pageSize * (this.state.activePage - 1) : 0;
            const max = this.state.displayPager ? this.state.pageSize * this.state.activePage : elements.length;
            return elements.map((element, index) => {
                if(min <= index && index < max) {
                    const isSelected = this.state.selection.find(selected => selected[this.getElementIdentifier()] === element[this.getElementIdentifier()]);
                    return (
                        <tr key={index} className={isSelected ? 'bg-warning' : ''} onClick={event => this.handleSelection({ ...event, target: { ...event.target, checked: !isSelected } }, element)}>
                            {!this.props.disableCheck && this.props.massActions && this.props.massActions.length ? this.renderRowSelection(element, index) : null}
                            {this.renderRow(element, index)}
                            {this.renderRowAction(element, index)}
                        </tr>
                    );
                }
                return null;
            });
        }
    }

    renderRowSelection(element, index) {
        return <td><input type="checkbox" checked={this.state.selection.find(selected => selected[this.getElementIdentifier()] === element[this.getElementIdentifier()]) || false} onChange={event => this.handleSelection(event, element)} /></td>;
    }

    renderRow(element, index) {
        return this.props.columns ? this.props.columns.map((column, index) => <td key={index}>{this.getCelDisplay(element, column)}</td>) : '';
    }

    renderRowAction(element, index) {
        if(this.props.renderActions) {
            return <td className="text-right">{this.props.renderActions(element, index)}</td>;
        }
    }

    renderSelectionSummary() {
        if(this.state.selection && this.state.selection.length) {
            return (
                <span><span className="text-secondary"><FormattedMessage id="tableSelection" defaultMessage="{count} selected" values={{ count: this.state.selection.length }} /></span> / </span>
            );
        }
        return null;
    }

    renderPager(searchedElements) {
        const pages = this.getSearchedPages(searchedElements);
        if(pages.length > this.state.pagerSize) {
            return (
                <Fragment>
                    {this.state.activePage > this.state.pagerSize / 2 && pages.length > this.state.pagerSize / 2 && this.renderPage(1, '<<')}
                    {pages.slice(Math.max(0, this.state.activePage - this.state.pagerSize / 2), Math.min(pages.length, this.state.activePage + this.state.pagerSize / 2)).map(pageNumber => this.renderPage(pageNumber))}
                    {this.state.activePage < (pages.length - this.state.pagerSize / 2) && pages.length > this.state.pagerSize / 2 && this.renderPage(pages.length, '>>')}
                </Fragment>
            );
        }
        return pages.map(pageNumber => this.renderPage(pageNumber));
    }

    renderPage(pageNumber, text = null) {
        return <PaginationItem key={pageNumber} active={this.state.activePage === pageNumber} size="sm"><PaginationLink onClick={(event) => this.setActivePage(event, pageNumber)}>{text || pageNumber}</PaginationLink></PaginationItem>;
    }

    renderMassActions() {
        if(this.props.massActions) {
            return (
                <div>
                    <InputGroup size="sm">
                        <InputGroupAddon addonType="prepend"><InputGroupText><FormattedMessage id="tableMassActions" defaultMessage="Bulk actions" /></InputGroupText></InputGroupAddon>
                        <Input type="select" name="massAction" value={this.state.massAction.id || ''} onChange={event => this.setState({ massAction: this.props.massActions.find(action => action.id === event.target.value) || { id: '' } })}>
                            <FormattedMessage id="selectOptions" defaultMessage="Select an option">
                                {message => <option value="">{message}</option>}
                            </FormattedMessage>
                            {this.props.massActions.map((action, index) => <option key={index} value={action.id}>{action.label}</option>)}
                        </Input>
                        {
                            this.state.massAction && this.state.massAction.options
                            ? this.renderMassActionOptions()
                            : null
                        }
                        {this.state.massAction.action ? <InputGroupAddon addonType="append"><Button color="success" onClick={event => { this.state.massAction.action(this.state.selection, this.state.massAction); this.setState({ massAction: { id: '' } }); }}><FontAwesome name="check" /></Button></InputGroupAddon> : null}
                    </InputGroup>
                </div>
            );
        }
    }

    renderMassActionOptions() {
        return this.state.massAction.options.map((option, index) => {
            switch(option.type) {
                case 'select':
                    return (
                        <Input key={index} type="select" name={option.name} value={(this.state.massAction.datas && this.state.massAction.datas[option.name]) || ''} onChange={event => this.setState({ massAction: { ...this.state.massAction, datas: { ...this.state.massAction.datas, [option.name]: event.target.value } } })}>
                            <FormattedMessage id="selectOptions" defaultMessage="Select an option">
                                {message => <option value="">{message}</option>}
                            </FormattedMessage>
                            {option.values.map((value, index) => <option key={index} value={value}>{value}</option>)}
                        </Input>
                    );

                default:
                    return '';
            }
        });
        // <span key={index}>{option.name}</span>) // TODO: Handle mass action options with multiple type of option: select, text
    }

    render() {
        const searchedElements = this.getSearchedElements();
        if(this.state.displayImporter) {
            return (
                <Importer columns={this.props.columns.map((column, index) => { return { ...column, index: column.index || index }; })} handleImport={this.handleImport} closeForm={event => this.setState({ displayImporter: false })} />
            );
        }
        return (
            <Row>
                {
                    this.hasFilters()
                    ?
                        <Col xs="12" lg="2">
                            {this.renderFilters()}
                        </Col>
                    : null
                }
                <Col xs="12" lg={this.hasFilters() ? '10' : '12'}>
                    <Card className="shadow mb-3">
                        {this.renderSearch()}
                        <CardBody>
                            {
                                searchedElements && searchedElements.length
                                ?
                                    <BootstrapTable hover responsive>
                                        {this.renderHeaders()}
                                        <tbody>
                                            {this.renderRows(searchedElements)}
                                        </tbody>
                                        {
                                            this.state.displayPager
                                            ?
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={this.getTotalColumnsCount()}>
                                                            <Row>
                                                                <Col>
                                                                    {this.renderSelectionSummary()}<strong><FormattedMessage id="elementsCount" defaultMessage="{count} elements" values={{ count: searchedElements.length }} /></strong>
                                                                </Col>
                                                                <Col>
                                                                    <Pagination size="sm" className="pagination justify-content-center">
                                                                        {this.renderPager(searchedElements)}
                                                                    </Pagination>
                                                                </Col>
                                                                <Col>
                                                                    <Input type="select" bsSize="sm" value={this.state.pageSize || ''} onChange={this.handlePageSizeSwitch}>
                                                                        <option>10</option>
                                                                        <option>20</option>
                                                                        <option>50</option>
                                                                        <option>100</option>
                                                                    </Input>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                {
                                                                    this.props.massActions && this.props.massActions.length
                                                                    ?
                                                                        <Col xs="12" md={{ size: 6, offset: 6 }} lg={{ size: 3, offset: 9 }}>
                                                                            {this.renderMassActions()}
                                                                        </Col>
                                                                    : null
                                                                }
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            : null
                                        }
                                    </BootstrapTable>
                                :
                                    <Alert color="warning" className="text-center">
                                        <FontAwesome name="exclamation-triangle" /> <FormattedMessage id="elementNoItems" defaultMessage="No items" />
                                    </Alert>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

// <InputGroupAddon><Button color="secondary" onClick={() => this.setState({displaySearchInput: false})}><FontAwesome name="times" /></Button></InputGroupAddon>
// <Button color="secondary" size="sm" className="pull-right" onClick={() => this.setState({displaySearchInput: true})}><FontAwesome name="search" /></Button>

Table.propTypes = {
    intl: intlShape.isRequired,
    id: PropTypes.string,
    table: PropTypes.object,
    elements: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    elementIdentifier: PropTypes.string,
    filters: PropTypes.array,
    searchFilters: PropTypes.array,
    searchText: PropTypes.string,
    pagerSize: PropTypes.string,
    displayPager: PropTypes.bool,
    displaySearchInput: PropTypes.bool,
    disableCheck: PropTypes.bool,
    massActions: PropTypes.array,
    renderActions: PropTypes.func,
    excludeSortColumns: PropTypes.array,
    includeSortColumns: PropTypes.array,
    refresh: PropTypes.func,
    update: PropTypes.func,
    import: PropTypes.func,
};

export default injectIntl(Table);
