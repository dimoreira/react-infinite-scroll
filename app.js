var Project = React.createClass({
	render: function() {
		var project = this.props.project;

		return (
			<div>
				<li className="data-item">
					<h1>{project.name}</h1>
					<h3>{project.deadline}</h3>
				</li>
			</div>
		);
	}
});

var InfScrollApp = React.createClass({
	getInitialState: function() {
		return {
			projects: null,
			nextPage: null
		};
	},

	loadInitialContent: function() {
		var self = this;
		$.ajax({
			url: "http://localhost:8000/api/projects.json",
			success: function(response) {
				console.log(response);
				if (response.meta.next_page_url) {
					$('.button-more').show();
					$('.loader img').hide();
				} else {
					$('.button-more').hide();
					$('.loader img').hide();
					$('.no-more').show();
				}
				self.setState({
					projects: response.data,
					nextPage: response.meta.next_page_url
				});
			},
			error: function(xhr, status, error) {
				console.log(error);
				self.setState({
					projects: null,
					nextPage: null
				});
			}
		});
	},

	componentDidMount: function() {
		var self = this;
		$('.button-more').hide();
		$('.loader img').show();
		setTimeout(function() {
			self.loadInitialContent();
		}, 1000);
	},

	loadMore: function() {
		var next_page_url = this.state.nextPage;
		var self = this;
		$('.button-more').hide();
		$('.loader img').show();
		$('no-more').hide();
		setTimeout(function() {
			$.ajax({
				url: next_page_url,
				success: function(response) {
					console.log(response);
					if (response.meta.next_page_url) {
						$('.button-more').show();
						$('.loader img').hide();
					} else {
						$('.button-more').hide();
						$('.loader img').hide();
						$('.no-more').show();
					}
					var projects = self.state.projects;
					response.data.forEach(function(p) {
						projects.push(p);
					});
					self.setState({
						projects: projects,
						nextPage: response.meta.next_page_url
					});
				},
				error: function(xhr, status, error) {
					console.log(error);
					self.setState({
						projects: null,
						nextPage: null
					});
				}
			});
		}, 1000);
	},

	render: function() {
		var projects = this.state.projects;
		var list;
		if (projects) {
			list = projects.map(function(project) {
				return <Project project={project} key={project.name}/>
			});
		}

		return(
			<div className="scroll-app">
				<ul className="data-container">
					{list}
				</ul>
				<button type="button" className="button-more" onClick={this.loadMore}>
					Load more items
				</button>
				<div className="loader">
					<img src="loading.svg" width="40"/>
				</div>
				<div className="no-more">
					No more projects to show
				</div>
			</div>
		);
	}
});

React.render(
	<InfScrollApp/>,
	document.getElementById('content')
);
