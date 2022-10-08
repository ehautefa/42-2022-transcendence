import React from "react";

type MyState = {
    picture: any;
    src: string;
}

export default class PictureUploader extends React.Component<{}, MyState>{
    constructor(props: any) {
        super(props);
        this.state = {
            picture: "",
            src: ""
        };
    }

    handlePictureSelected(event: any) {
        var picture = event.target.files[0];
        var src = URL.createObjectURL(picture);

        this.setState({
            picture: picture,
            src: src
        });
    }

    renderPreview() {
        if (this.state.src !== "") {
            return (
                <img src={this.state.src} alt="Preview of your avatar" />
            );
        } else {
            return (
                <div>No preview</div>
            );
        }
    }

    async upload() {
        var url: string = process.env.REACT_APP_BACK_URL + "/user/uploadPicture";
        var credentials: RequestCredentials = "include";

        var formData = new FormData();
        formData.append("file", this.state.picture);

        var requestOptions = {
            method: 'POST',
            body: formData,
            credentials: credentials
        };

        let result = await (await fetch(url, requestOptions)).json();
        if (result.statusCode === 401) {
            window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
        }
    }



    render() {
        return (
            <div className="pictureUploader">
                <input type="file" name="file" id="file" className="inputfile" onChange={this.handlePictureSelected.bind(this)} />
                {this.renderPreview()}
                <button onClick={this.upload.bind(this)}>Upload</button>
            </div>
        );
    }
}