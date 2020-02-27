# Launcher

> Launcher shows all SpaceX launches, rockets, pods and dragons from 2006 to now. Users can view details and filter the results

![Launcher home page](assets/launcher-home-page.png)

## Installation
```bash
# Clone the repository
git clone https://github.com/kriskuiper/web-app-from-scratch-1920.git

# Install dependencies using yarn or npm
yarn / npm install

# Run a local development environment on port x
yarn dev / npm run dev
```

## Actor diagram
![Launcher actor diagram](assets/actor-diagram-new.png)

## Interaction diagrams
Below are some interaction diagrams for specific actions in the application.

### Rendering the homepage
![Homepage rendering interaction diagram](assets/home-page-rendering-new.png)

## Features
### Overview
An overview of the data a user wants to see, results are paginated and get updated while the user scrolls down.

## Pagination
Results are paginated. Each page has a limit of 24 results. When clicking 'load more' results will be loaded and added to the already present results.

### Details
User can see details of a specific launch or rocket on a detail page. The detail page consists of a description, some minor details like the launch site and a video of the launch if available.

## API
For this project I used the SpaceX API. You can view the docs [here](https://docs.spacexdata.com/?version=latest).

### Rate limiting
As quoted by the docs:
> The API has a rate limit of 50 req/sec per IP address, if exceeded, a response of 429 will be given until the rate drops back below 50 req/sec

### Caching
Again, as quoted by the docs:
> In general, the standard cache times are as follows:
> - launches - 30 seconds
> - ships, payloads, roadster - 5 minutes
> - capsules, cores, launchpads, landpads - 1 hour
> - dragons, rockets, missions, history, company info - 24 hours

### Endpoints used
The application uses the following endpoints of the SpaceX API:

- `/launches`
	- Shows all launches from SpaceX, results get updated regularly;
- `/launches/:flight_number`
	- Gets specific data for one launch, used to render the detail page with;
- `/rockets`
	- Shows SpaceX launches completely with details.

### API limitations
As far as I know there are no limitations to the API. You can just call the above endpoints and will get data back. Every. Single. Time.

## Project wishlist
- [ ] Make it a Progressive Web App
- [ ] Make the project use it's own virtual DOM
- [ ] Make it server-side rendered
