import React from 'react';
import unsplash from "../api/unsplash";

import SearchBar from "./SearchBar";
import "../css/App.css";
import ImageList from "./ImageList";


class App extends React.Component {
    state = {images: []};

    onSearchSubmit = async (term) => {
        const response = await unsplash.get('/search/photos', {
            params: {
                query: term
            }
        });
        this.setState({images: response.data.results})
    };

    render() {
        return (
            <div className="ui container" style={{marginTop: '1em'}}>
                <SearchBar onSubmit={this.onSearchSubmit}/>
                <div>{this.state.images.length > 0 ? `Found: ${this.state.images.length} images` : ""}</div>
                <ImageList images={this.state.images}/>
            </div>
        );
    }
}


export default App;
