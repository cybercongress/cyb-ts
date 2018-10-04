import React, {Component} from 'react';

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 

class App extends Component {

	state = {
		query: '',
		links: [ {
			hash: 'QmfPt3HrNyvq8F1vYEsexY7B5ftmgZS7fraSbVkqDLH1CK'
		}, 
		{
			hash: 'QmZP5VsY5r2i7FekSJf6tjkByw97FusJKSQ2Y8euczfhZw'
		} ]
	}

	componentWillMount() {
		this.setState({
			query: getQueryStringValue('query')
		})
	}

    render() {
        return (
        	<div>
	            <input defaultValue={this.state.query} />
            	<a href="cyb://status">Status</a>
            	<div>
            		{ 
            			this.state.links.map(link =>
            			<div key={link.hash}> 
            				<a href={`cyb://${link.hash}.ipfs`}> {link.hash} </a>
            			</div>
            			) 
            		}
            	</div>
            </div>
        )
    }
}

export default App;
