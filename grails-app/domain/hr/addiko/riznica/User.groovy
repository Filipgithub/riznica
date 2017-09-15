package hr.addiko.riznica

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import hr.addiko.riznica.comment.Comment
import hr.addiko.riznica.post.Post


@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
@JsonIgnoreProperties('springSecurityService')
class User implements Serializable {

    private static final long serialVersionUID = 1
    static hasMany = [comments: Comment, posts1: Post]
    transient springSecurityService


    String username
    String password
    boolean enabled = true
    boolean accountExpired
    boolean accountLocked
    boolean passwordExpired

    Set<Role> getAuthorities() {
        UserRole.findAllByUser(this)*.role
    }

    def beforeInsert() {
        encodePassword()
    }

    def beforeUpdate() {
        if (isDirty('password')) {
            encodePassword()
        }
    }

    protected void encodePassword() {
        password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
    }

    static transients = ['springSecurityService']

    static constraints = {
        password blank: false, password: true
        username blank: false, unique: true
        //comments nullable: true
    }

    static mapping = {
        password column: '`password`'
    }

}
