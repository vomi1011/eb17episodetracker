package de.eb17.episodetracker.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.NoResultException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.ClientRequest;

import de.eb17.episodetracker.data.MemberRepository;
import de.eb17.episodetracker.data.SerieRepository;
import de.eb17.episodetracker.model.Member;
import de.eb17.episodetracker.model.Serie;
import de.eb17.episodetracker.service.SerieTracker;
import de.eb17.episodetracker.util.json.JSONObject;

/**
 * This class produces a RESTful service to handle requests for tracking a serie.
 */
@Path("/track")
@RequestScoped
@Stateful
public class TrackerService {
	
	@Inject
	private SerieRepository repository;
	
	@Inject
	private MemberRepository memberRepository;
	
	@Inject
	private SerieTracker tracker;

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	public Serie track(@QueryParam("id") Long id, @QueryParam("url") String url) throws Exception {
		String baseUrl = "http://api.trakt.tv/show/summary.json/9cff985e69115c385d612802a214d976/";
		ClientRequest serieSummary = new ClientRequest(baseUrl + url);
		JSONObject serieRaw = new JSONObject(serieSummary.get(String.class).getEntity());
		String fullUrl = serieRaw.getString("url");
		String trUrl = fullUrl.substring(21, fullUrl.length());
		String air_day =serieRaw.getString("air_day");
		String air_time = serieRaw.getString("air_time");
		String network = serieRaw.getString("network");
		String poster = serieRaw.getString("poster");

		Serie serie;
		
		try {
			serie = repository.findByUrl(trUrl);
		}
		catch (NoResultException ex) {
			serie = new Serie();
			serie.setTitle(serieRaw.getString("title"));
			serie.setUrl(trUrl);
			serie.setAir_day(air_day);
			serie.setAir_time(air_time);
			serie.setNetwork(network);
			serie.setPoster(poster);

			repository.store(serie);
		}
		
		try {
			Member member = memberRepository.findById(id);
			
			if(!member.getTrack().contains(serie)) {
				member.track(serie);
			}
		}
		catch(Exception ex) {
			throw new WebApplicationException(Response.Status.BAD_REQUEST);
		}
		
		return serie;
	}
}
