export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';

export const FileDownloadButton = createComponent({
  displayName: 'FileDownloadButton',
  render: fileDownloadButtonRender
});

function fileDownloadButtonRender() {
  const name = `${this.props.fileName}_${Date.now()}.json`;
  return (
    <a href={this.props.fileUrl}
       download={name}>
      {this.props.children}
    </a>
  );
}
