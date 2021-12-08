import React, { Component } from 'react';
// import GitHubButton from 'react-github-btn';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import TypeChecker from 'typeco';

import SearchField from './SearchField';
// import exampleSnippets from './exampleSnippets';

// import './App.css';

const exampleList = [
    {
        name: 'Joe Smith',
        email: 'joesmith@gmail.com',
    },
    {
        name: 'Alan Donald',
        email: 'alan@gmail.com',
    },
];

const getMatchedList = (searchText) => {
    if (TypeChecker.isEmpty(searchText)) return exampleList;
    return exampleList.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
};

const ExampleList = props => (
    <div className="list-example">
        {/* <div className="list-header">
            <ul>
                <li> Name </li>
                <li> Email </li>
            </ul>
        </div> */}
        <div className="list-body">
            {
                props.list.map((item, index) => (
                    <ul key={index}>
                        <li> {item.name} </li>
                        <li> {item.email} </li>
                    </ul>))
            }
        </div>
    </div>
);
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {

            onSearchClickExampleList: [...exampleList],
        };

        this.onSearchClickExample = this.onSearchClickExample.bind(this);

    }
    onSearchClickExample(value) {
        this.setState({
            onSearchClickExampleList: getMatchedList(value),
        });
    }
    render() {
        return (
            <div className="react-search-field-demo container">
                <div>
                    {/* <h5>Example: onSearchClick  </h5> */}

                    {/* {exampleSnippets.onSearchClickExample} */}

                    <SearchField
                        placeholder="Search item"
                        onSearchClick={this.onSearchClickExample}
                    />
                    <ExampleList
                        list={this.state.onSearchClickExampleList}
                    />
                </div>

            </div>
        );
    }
}

export default Search;