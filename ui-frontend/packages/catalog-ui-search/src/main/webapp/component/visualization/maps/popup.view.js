/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/

import * as React from 'react'
const Marionette = require('marionette')

import PopupPreview from '../../../react-component/popup-preview'

const PopupPreviewView = Marionette.ItemView.extend({
  template() {
    return (
      <PopupPreview
        map={this.options.map}
        mapModel={this.options.mapModel}
        selectionInterface={this.options.selectionInterface}
      />
    )
  },
})

module.exports = PopupPreviewView
