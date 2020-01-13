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

const Marionette = require('marionette')
const workspaceExploreTemplate = require('./workspace-explore.hbs')
const CustomElements = require('../../js/CustomElements.js')
const QuerySelectorView = require('../query-selector/query-selector.view.js')
const store = require('../../js/store.js')

const WorkspaceExplore = Marionette.LayoutView.extend({
  setDefaultModel() {
    this.model = store.getCurrentWorkspace()
  },
  template: workspaceExploreTemplate,
  tagName: CustomElements.register('workspace-explore'),
  modelEvents: {},
  events: {
    'click .querySelector-modal': 'openQueriesModal',
  },
  regions: {
    workspaceExploreQueries: '.workspaceExplore-queries',
  },
  initialize(options) {
    if (options.model === undefined) {
      this.setDefaultModel()
    }
  },
  onBeforeShow() {
    if (this.model) {
      this.workspaceExploreQueries.show(new QuerySelectorView())
    }
  },
})

module.exports = WorkspaceExplore