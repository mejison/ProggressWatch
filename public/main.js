new Vue({
    el: '#app',
    data: function() {
        return {
            emploees: [],
            watch: [],
            hash: ""
        }
    },
    methods: {
        toggleWatch: function(index) {
            if ( ! this.watch.some(i => i == index)) {
                this.watch.push(index);
            } else {
                this.watch = this.watch.filter(i => i != index);
            }

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
            if ( ! this.hash) {
                this.notify('error', 'No subscribe');
                return;
            }
            return this.hash;
        },
        checkOneSignal: function() {

        },
        notify: function(type, message) {
            toastr[type](message);
        }
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
        
        if (window.OneSignal) {
            OneSignal.push(function() {
                OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                    if (isEnabled) {
                        OneSignal.getUserId(function(userId) {
                            self.hash = userId;
                            self.getWatched();
                        });
                    }
                })
            });
        }
    }
})