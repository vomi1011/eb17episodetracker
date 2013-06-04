package de.eb17.episodetracker.service;

import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import de.eb17.episodetracker.model.Serie;

/**
 * Class for registering a member.
 *
 */
@Stateless
public class SerieTracker {

    @Inject
    private Logger log;

    @Inject
    private EntityManager em;

    public void store(Serie serie) throws Exception {
        log.info("Registering " + serie.getTitle());
        em.persist(serie);
    }
}
