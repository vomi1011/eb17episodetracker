package de.eb17.episodetracker.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@XmlRootElement
@Table(name = "member", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Member implements Serializable {
    /** Default value included to remove warning. Remove or modify at will. **/
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Size(min = 1, max = 25, message = "1-25 letters and spaces")
    @Pattern(regexp = "[^0-9]*", message = "Must not contain numbers")
    private String surname;

    @NotNull
    @Size(min = 1, max = 25, message = "1-25 letters and spaces")
    @Pattern(regexp = "[^0-9]*", message = "Must not contain numbers")
    private String forename;
    
    @NotNull
    @NotEmpty
    @Email(message = "Invalid format")
    private String email;

    @NotNull
    @NotEmpty
    private String password;

    @Pattern(regexp = "[^0-9]*", message = "Must not contain numbers")
    private String home;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
    		name="track",
    		joinColumns={@JoinColumn(name="member", referencedColumnName="id")},
    		inverseJoinColumns={@JoinColumn(name="serie", referencedColumnName="id")})
    List<Serie> track;

    public String getEmail() {
        return email;
    }
    
    public String getForename() {
		return forename;
	}

	public String getHome() {
		return home;
	}

	public Long getId() {
        return id;
    }

    public String getPassword() {
		return password;
	}

    public String getSurname() {
		return surname;
	}

	public List<Serie> getTrack() {
		return track;
	}

	public void setEmail(String email) {
        this.email = email;
    }

	public void setForename(String forename) {
		this.forename = forename;
	}

	public void setHome(String home) {
		this.home = home;
	}

    public void setId(Long id) {
        this.id = id;
    }

	public void setPassword(String password) {
		this.password = password;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public void setTrack(List<Serie> track) {
		this.track = track;
	}

	public List<Serie> track(Serie serie) {
    	if (track == null) {
    		track = new ArrayList<>();
    	}
    	
    	track.add(serie);
		
    	return track;
    }
}
