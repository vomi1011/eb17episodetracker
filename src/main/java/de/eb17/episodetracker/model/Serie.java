package de.eb17.episodetracker.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@XmlRootElement
@Table(name = "serie", uniqueConstraints = @UniqueConstraint(columnNames = "url"))
public class Serie implements Serializable {
    /** Default value included to remove warning. Remove or modify at will. **/
    private static final long serialVersionUID = 1L;

    @Id
    @SequenceGenerator(name="serie_gen", sequenceName="serie_seq")
    @GeneratedValue(generator="serie_gen")
    private Long id;

    @NotNull
    private String title;

    private String poster;

	@NotEmpty
    private String url;
    
    private String air_day;

    private String air_time;

    private String network;
    
    private int season;

	private int episode;

	public String getAir_day() {
		return air_day;
	}

	public String getAir_time() {
		return air_time;
	}

	public int getEpisode() {
		return episode;
	}

	public Long getId() {
		return id;
	}

	public String getNetwork() {
		return network;
	}

	public String getPoster() {
		return poster;
	}

	public int getSeason() {
		return season;
	}

	public String getTitle() {
		return title;
	}

	public String getUrl() {
		return url;
	}

	public void setAir_day(String air_day) {
		this.air_day = air_day;
	}

	public void setAir_time(String air_time) {
		this.air_time = air_time;
	}

	public void setEpisode(int episode) {
		this.episode = episode;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setNetwork(String network) {
		this.network = network;
	}

	public void setPoster(String poster) {
		this.poster = poster;
	}

	public void setSeason(int season) {
		this.season = season;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
