<template>
  <el-container direction='vertical'>
    <el-table
      @sort-change='handleSortChange'
      :data='displayUnivs'
      :default-sort='{prop: sortKey, order: sortOrder}'
      size='large'
      ref='refTable'
      @row-click='rowClicked'
    >
      <el-table-column type='expand'>
        <template slot-scope='univTable'>
          <el-tabs type='border-card'>
            <el-tab-pane label='Restaurants'>
              <el-table
                :data='univTable.row.restaurants'
                max-height='300'
                :default-sort="{prop: 'rating', order: 'descending'}"
              >
                <el-table-column prop='name' label='Name'></el-table-column>
                <el-table-column prop='rating' label='Rating' sortable>
                  <template slot-scope='scope'>
                    <el-rate :value='scope.row.rating' disabled/>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label='Location'>
              <GmapMap
                :options='{
                  zoomControl: true,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                  fullscreenControl: true,
                  disableDefaultUi: false
                }'
                :center='univTable.row.location'
                :zoom='16'
                style='width: 500px height: 300px'
              >
                <GmapMarker
                  :position='univTable.row.location'
                  :clickable='true'
                  :draggable='true'
                  @click='center=univTable.row.location'
                />
                <GmapMarker
                  :key='index'
                  v-for='(m,index) in univTable.row.restaurants'
                  :position='m.location'
                  :clickable='true'
                  :draggable='true'
                  :icon='iconPath'
                  @click='center=univTable.row.location'
                />
              </GmapMap>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column width='100' sortable='custom' prop='rank' label='Rank'></el-table-column>
      <el-table-column prop='name' label='Name'></el-table-column>
      <el-table-column label='Chinese Restaurants'>
        <template slot-scope='scope'>
          <a-tag color='blue'>
            <i class='fas fa-utensils'></i>
            ({{scope.row.restaurants.length}})
          </a-tag>
        </template>
      </el-table-column>
      <el-table-column prop='unitPrice' label='Housing Expense (USD)'></el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync='pageIndex'
      :page-size.sync='pageSize'
      :page-sizes='[20, 50, 100]'
      layout='total, sizes, prev, pager, next'
      :total='univs.length'
    ></el-pagination>
  </el-container>
</template>

<script>
import { http } from '../config/http.js'

export default {
  // Variables
  data: () => ({
    search: '',
    iconPath: 'images/res_36.png',
    headers: [
      {
        text: 'Rank',
        align: 'left',
        value: 'rank'
      },
      { text: 'University', value: 'name' },
      { text: 'Address', value: 'address' }
    ],
    errors: [],
    univs: [],
    pageIndex: 1,
    pageSize: 20,
    sortKey: 'rank',
    sortOrder: 'ascending'
  }),

  computed: {
    sortedUnivs () {
      return this.univs
      // if (this.sortOrder === 'ascending') {
      //   return this.univs.sort((a, b) => a.rank - b.rank)
      // } else {
      //   return this.univs.sort((a, b) => b.rank - a.rank)
      // }
    },
    displayUnivs () {
      return this.sortedUnivs.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      )
    }
  },

  // The methods we will need
  methods: {
    getIcon (){
      return {
        
      }
    },
    rowClicked(row) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    handleSortChange({ column, order }) {
      this.sortKey = column
      this.sortOrder = order
    },
    // load all univs from DB, we call this often to make sure the data is up to date
    load () {
      http
        .get('univs')
        .then(response => {
          this.univs = response.data.univs
        })
        .catch(e => {
          this.errors.push(e)
        })
    },

    // opens delete dialog
    setupDelete(user) {
      this.userToDelete = user
      this.deleteDialog = true
    },

    // opens edit dialog
    setupEdit(user) {
      Object.keys(user).forEach(key => {
        this.userToEdit[key] = user[key]
      })
      this.editName = user.name
      this.editDialog = true
    },

    // build the alert info for us
    // Will emit an alert, followed by a boolean for success, the type of call made, and the name of the
    // resource we are working on
    alert(success, callName, resource) {
      this.$emit('alert', success, callName, resource)
      this.load()
    }
  },

  // get those univs
  mounted () {
    this.load()
  }
}
</script>
