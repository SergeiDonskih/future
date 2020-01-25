new Vue({
    el:'#app',
    data: {
      point: 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D',
      elements:[],
      filterEl:[],
      add: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          streetAddress: '',
          city: '',
          state: '',
          zip: ''
        },
        description: ''
      },
      show: {
        firstName: '',
        lastName: '',
        address: {
          streetAddress: '',
          city: '',
          state: '',
          zip: ''
        },
        description: ''
      },
      columns: ['id', 'firstName', 'lastName', 'email', 'phone'],
      perPage: 40,
      flag: true,
      pagination: {},
      query: {
        column: 'id',
        direction: 'asc',
      },
      search: '',
      isActive: false,
      showBlock: false,
      loading: true
    },
    computed: {
      collection() {
        if (!this.search) {
          this.filterEl = this.elements
        } 
        return this.paginate(this.filterEl)
      }
    },
    methods: {
      filtered(search) {   
        var row = this.elements
        this.filterEl = []
        for (var key in row) {
          for (var key2 in row[key]) {
            if (String(row[key][key2]).toLowerCase().indexOf(String(search).toLowerCase()) !== -1) {
              this.filterEl.push(row[key])
            } 
          }
        } 
        this.setPage(1)
      },
      onSubmit() {
        this.elements.unshift(this.add)
        this.filterEl.unshift(this.add)
      },
      getAllElements() {
        if (this.flag) {
          this.$http.get(this.point).then(function(response) {
            this.elements = response.data
            this.flag = false
            this.setPage(1)
            this.loading = false
          })
        }
      },
      setPage(p) {
        if (!this.search) {
          this.filterEl = this.elements
        } 
        this.pagination = this.paginator(this.filterEl.length, p)
      },
      paginate(elements) {
        return _.slice(elements, this.pagination.startIndex, this.pagination.endIndex + 1)
      },
      paginator(totalItems, currentPage) {
        var startIndex = (currentPage - 1) * this.perPage,
        endIndex = Math.min(startIndex + this.perPage - 1, totalItems -1)
  
        return {
          currentPage: currentPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: _.range(1, Math.ceil(totalItems / this.perPage + 1))

        }
      },
      toggleOrder(column) {
        if (column === this.query.column) {
            if (this.query.direction === 'desc') {
                this.query.direction = 'asc'
            } else {
                this.query.direction = 'desc'
            }
        } else {
            this.query.column = column
            this.query.direction = 'asc'
        }
        this.elements = this.sortArrays(this.elements, column)
        this.filterEl = this.sortArrays(this.filterEl, column)
      },
      sortArrays(elements, column) {
        return _.orderBy(elements, column, this.query.direction);
      },
      showDetail(element) {
        if ( !this.showBlock ) {
          this.showBlock = !this.showBlock
        }
        this.show.firstName = element.firstName
        this.show.lastName = element.lastName
        this.show.description = element.description
        this.show.address.streetAddress = element.address.streetAddress
        this.show.address.city = element.address.city
        this.show.address.state = element.address.state
        this.show.address.zip = element.address.zip
      }
    },
    created() {
      this.getAllElements()
    }
  })