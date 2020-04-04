<template>
  <div class="text-center">
    <br>
    <small class="text-muted">Exibindo {{ meta.from }}-{{ meta.to}} de {{ meta.total }} registros(s).</small>
    <br>
    <nav aria-label="pagination">
      <ul class="pagination justify-content-center">
        <li :class="{ 'disabled': meta.current_page <= 1 }" class="page-item">
          <a
            href="javascript:void(0)"
            aria-label="Previous"
            v-on:click.prevent="changePage(1)"
            class="page-link"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li :class="{ 'disabled': meta.current_page <= 1 }" class="page-item">
          <a
            href="javascript:void(0)"
            aria-label="Previous"
            v-on:click.prevent="changePage(meta.current_page - 1)"
            class="page-link"
          >
            <span aria-hidden="true">&lsaquo;</span>
          </a>
        </li>
        <li
          v-for="page in pagesNumber"
          :class="{'active': page == meta.current_page}"
          :key="page"
          class="page-item"
        >
          <a
            href="javascript:void(0)"
            v-on:click.prevent="changePage(page)"
            class="page-link"
          >{{ page }}</a>
        </li>
        <li :class="{ 'disabled': meta.current_page >= meta.last_page }" class="page-item">
          <a
            href="javascript:void(0)"
            aria-label="Next"
            v-on:click.prevent="changePage(meta.current_page + 1)"
            class="page-link"
          >
            <span aria-hidden="true">&rsaquo;</span>
          </a>
        </li>
        <li :class="{ 'disabled': meta.current_page >= meta.last_page }" class="page-item">
          <a
            href="javascript:void(0)"
            aria-label="Next"
            v-on:click.prevent="changePage(meta.last_page)"
            class="page-link"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <br>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    },
    offset: {
      type: Number,
      default: 4
    }
  },
  computed: {
    meta() {
      if (this.pagination.meta) {
        return this.pagination.meta;
      } else {
        return {
          current_page: this.pagination.current_page,
          from: this.pagination.from,
          last_page: this.pagination.last_page,
          path: this.pagination.path,
          per_page: this.pagination.per_page,
          to: this.pagination.to,
          total: this.pagination.total
        };
      }
    },
    links() {
      if (this.pagination.links) {
        return this.pagination.links;
      } else {
        return {
          first: this.pagination.first_page_url,
          last: this.pagination.last_page_url,
          prev: this.pagination.prev_page_url,
          next: this.pagination.next_page_url
        };
      }
    },
    pagesNumber() {
      if (!this.meta.to) {
        return [];
      }
      let from = this.meta.current_page - this.offset;
      if (from < 1) {
        from = 1;
      }
      let to = from + this.offset * 2;
      if (to >= this.meta.last_page) {
        to = this.meta.last_page;
      }
      let pagesArray = [];
      for (let page = from; page <= to; page++) {
        pagesArray.push(page);
      }
      return pagesArray;
    }
  },
  methods: {
    changePage(page) {
      this.$emit("paginate", page);
    }
  }
};
</script>
