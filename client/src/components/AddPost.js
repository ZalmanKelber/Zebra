import React, { Component } from "react";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as actions from "../actions";

class AddPost extends Component {
  state = {
    htmlContent: "",
    edit: false,
    exceedMessage: false
   }

   componentWillUnmount = () => {
     this.setState({ edit: false, htmlContent: "" });
   }

   handleCancel = e => {
     e.preventDefault();
     this.setState({ edit: false, htmlContent: "" });
   }

   handleSave = async e => {
     e.preventDefault();
     if (this.props.isComment) {
       await this.props.handleSave(this.state.htmlContent);
     }
     else {
       await this.props.createPost(this.state.htmlContent, this.props.profileId);
     }
     this.setState({ edit: false, htmlContent: ""});
   }

   handleChange = content => {
     if (content.length < 300) {
       this.setState({ htmlContent: content, exceedMessage: false });
     }
     else {
       this.setState({ exceedMessage: true });
     }
   }

    modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["link"],
      ],
    }

    formats = [
      "bold", "italic", "underline", "strike", "link"
    ]

  render() {
    return(
      <div className="add-post">
        {
          !this.state.edit &&
          <a href="" onClick={e => {
            e.preventDefault();
            this.setState({ edit: true })
          }}>
            <b>{this.props.isComment ? "add a comment" : "New post"}</b> <i className="material-icons md-12">edit</i>
          </a>
        }
        {
          this.state.edit &&
          <>
            <div className="ui form">
              <div className="field">
              {
                this.state.exceedMessage &&
                <div className="post-date red-italic">Maximum length exceeded</div>
              }
                <ReactQuill
                  theme="snow"
                  modules={this.modules}
                  formats={this.formats}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="post-options">
              <a
                href=""
                onClick={this.handleSave}
              >
                <b>save post</b><i className="material-icons md-12">save</i>
              </a>
              <a href="" onClick={this.handleCancel}><b>cancel</b><i className="material-icons md-12">cancel</i></a>
            </div>
          </>
        }
      </div>
    );
  }
}

export default connect(null, actions)(AddPost);
