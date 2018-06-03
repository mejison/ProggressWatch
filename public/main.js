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
            } else {
                this.watch = this.watch.filter(i => i != index);
            }

            console.log(this.watch)

            fetch('/api/watcher', {
                headers: {
                    'Content-type': 'application/json',
                },
                method: 'put',
                body: JSON.stringify({emploee : this.watch, hash: this.getHash()})
            });
        },
        getWatched: function() {
            let hash = this.getHash();
            if (hash) {
                let self = this;
                fetch('/api/watcher?hash=' + hash)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        self.watch = data.map(function(d) { return d.index });
                    });
            }
        },
        getHash: function() {
            return '2342sdf234';
        }
    },
    created: function() {
        this.getWatched();
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