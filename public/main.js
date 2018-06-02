new Vue({
    el: '#app',
    data: function() {
        return {
            emploees: [],
            watch: []
        }
    },
    methods: {
        toggleWatch: function(index) {
            if ( ! this.watch.some(i => i == index)) {
                this.watch.push(index);
                return;
            }
            this.watch = this.watch.filter(i => i != index);
        }
    },
    created: function() {

    },
    mounted: function() {
        let self = this;
        fetch('/api/progress')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                self.emploees = data;
            });
    }
})