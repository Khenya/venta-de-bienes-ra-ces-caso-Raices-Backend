PGDMP  2                    }            raices    17.4    17.4 T    _           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            `           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            a           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            b           1262    16388    raices    DATABASE     l   CREATE DATABASE raices WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE raices;
                     postgres    false            �            1259    16508    customer    TABLE     �   CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    name character varying(50) NOT NULL,
    phone integer,
    ci integer NOT NULL
);
    DROP TABLE public.customer;
       public         heap r       postgres    false            �            1259    16507 "   adjudicatario_id_adjudicatario_seq    SEQUENCE     �   CREATE SEQUENCE public.adjudicatario_id_adjudicatario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.adjudicatario_id_adjudicatario_seq;
       public               postgres    false    232            c           0    0 "   adjudicatario_id_adjudicatario_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.adjudicatario_id_adjudicatario_seq OWNED BY public.customer.customer_id;
          public               postgres    false    231            �            1259    16447    property    TABLE     n  CREATE TABLE public.property (
    property_id integer NOT NULL,
    manzano integer NOT NULL,
    batch integer NOT NULL,
    state character varying(50) NOT NULL,
    meters integer NOT NULL,
    price integer,
    folio_number integer,
    numero_inmueble integer,
    testimony_numbre integer,
    location character varying(255),
    property_number integer
);
    DROP TABLE public.property;
       public         heap r       postgres    false            �            1259    16446    inmueble_inmueble_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inmueble_inmueble_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.inmueble_inmueble_id_seq;
       public               postgres    false    227            d           0    0    inmueble_inmueble_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.inmueble_inmueble_id_seq OWNED BY public.property.property_id;
          public               postgres    false    226            �            1259    16520    notification    TABLE     t   CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    text character varying(50) NOT NULL
);
     DROP TABLE public.notification;
       public         heap r       postgres    false            �            1259    16519    notficacion_id_notificacion_seq    SEQUENCE     �   CREATE SEQUENCE public.notficacion_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.notficacion_id_notificacion_seq;
       public               postgres    false    234            e           0    0    notficacion_id_notificacion_seq    SEQUENCE OWNED BY     d   ALTER SEQUENCE public.notficacion_id_notificacion_seq OWNED BY public.notification.notification_id;
          public               postgres    false    233            �            1259    16526    notification_customer_property    TABLE     �   CREATE TABLE public.notification_customer_property (
    id_inmueble integer NOT NULL,
    customer_id integer NOT NULL,
    notification_id integer NOT NULL
);
 2   DROP TABLE public.notification_customer_property;
       public         heap r       postgres    false            �            1259    16481    observation    TABLE     �   CREATE TABLE public.observation (
    observation_id integer NOT NULL,
    observacion character varying(50) NOT NULL,
    date date NOT NULL,
    property_id integer NOT NULL
);
    DROP TABLE public.observation;
       public         heap r       postgres    false            �            1259    16480    observacion_id_observacion_seq    SEQUENCE     �   CREATE SEQUENCE public.observacion_id_observacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.observacion_id_observacion_seq;
       public               postgres    false    230            f           0    0    observacion_id_observacion_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.observacion_id_observacion_seq OWNED BY public.observation.observation_id;
          public               postgres    false    229            �            1259    16431    owner    TABLE     a   CREATE TABLE public.owner (
    ci integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.owner;
       public         heap r       postgres    false            �            1259    16465    owner_property    TABLE     h   CREATE TABLE public.owner_property (
    owner_id integer NOT NULL,
    property_id integer NOT NULL
);
 "   DROP TABLE public.owner_property;
       public         heap r       postgres    false            �            1259    16389 
   permission    TABLE     \   CREATE TABLE public.permission (
    id integer NOT NULL,
    name character varying(50)
);
    DROP TABLE public.permission;
       public         heap r       postgres    false            �            1259    16392    permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.permissions_id_seq;
       public               postgres    false    217            g           0    0    permissions_id_seq    SEQUENCE OWNED BY     H   ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permission.id;
          public               postgres    false    218            �            1259    16393    permissions_roles    TABLE     s   CREATE TABLE public.permissions_roles (
    id integer NOT NULL,
    permissions_id integer,
    rol_id integer
);
 %   DROP TABLE public.permissions_roles;
       public         heap r       postgres    false            �            1259    16396    permissions_roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.permissions_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.permissions_roles_id_seq;
       public               postgres    false    219            h           0    0    permissions_roles_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.permissions_roles_id_seq OWNED BY public.permissions_roles.id;
          public               postgres    false    220            �            1259    16546    property_users    TABLE     g   CREATE TABLE public.property_users (
    property_id integer NOT NULL,
    user_id integer NOT NULL
);
 "   DROP TABLE public.property_users;
       public         heap r       postgres    false            �            1259    16397    role    TABLE     d   CREATE TABLE public.role (
    role_id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.role;
       public         heap r       postgres    false            �            1259    16400    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public               postgres    false    221            i           0    0    roles_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.roles_id_seq OWNED BY public.role.role_id;
          public               postgres    false    222            �            1259    16401    users    TABLE     �   CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    rol_id integer
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16404    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    223            j           0    0    users_id_seq    SEQUENCE OWNED BY     B   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;
          public               postgres    false    224            �           2604    16511    customer customer_id    DEFAULT     �   ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.adjudicatario_id_adjudicatario_seq'::regclass);
 C   ALTER TABLE public.customer ALTER COLUMN customer_id DROP DEFAULT;
       public               postgres    false    231    232    232            �           2604    16523    notification notification_id    DEFAULT     �   ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notficacion_id_notificacion_seq'::regclass);
 K   ALTER TABLE public.notification ALTER COLUMN notification_id DROP DEFAULT;
       public               postgres    false    234    233    234            �           2604    16484    observation observation_id    DEFAULT     �   ALTER TABLE ONLY public.observation ALTER COLUMN observation_id SET DEFAULT nextval('public.observacion_id_observacion_seq'::regclass);
 I   ALTER TABLE public.observation ALTER COLUMN observation_id DROP DEFAULT;
       public               postgres    false    229    230    230            �           2604    16405    permission id    DEFAULT     o   ALTER TABLE ONLY public.permission ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);
 <   ALTER TABLE public.permission ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217            �           2604    16406    permissions_roles id    DEFAULT     |   ALTER TABLE ONLY public.permissions_roles ALTER COLUMN id SET DEFAULT nextval('public.permissions_roles_id_seq'::regclass);
 C   ALTER TABLE public.permissions_roles ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            �           2604    16450    property property_id    DEFAULT     |   ALTER TABLE ONLY public.property ALTER COLUMN property_id SET DEFAULT nextval('public.inmueble_inmueble_id_seq'::regclass);
 C   ALTER TABLE public.property ALTER COLUMN property_id DROP DEFAULT;
       public               postgres    false    226    227    227            �           2604    16407    role role_id    DEFAULT     h   ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 ;   ALTER TABLE public.role ALTER COLUMN role_id DROP DEFAULT;
       public               postgres    false    222    221            �           2604    16408    users user_id    DEFAULT     i   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    224    223            X          0    16508    customer 
   TABLE DATA           @   COPY public.customer (customer_id, name, phone, ci) FROM stdin;
    public               postgres    false    232   Eg       Z          0    16520    notification 
   TABLE DATA           =   COPY public.notification (notification_id, text) FROM stdin;
    public               postgres    false    234   �h       [          0    16526    notification_customer_property 
   TABLE DATA           c   COPY public.notification_customer_property (id_inmueble, customer_id, notification_id) FROM stdin;
    public               postgres    false    235   �h       V          0    16481    observation 
   TABLE DATA           U   COPY public.observation (observation_id, observacion, date, property_id) FROM stdin;
    public               postgres    false    230   �h       Q          0    16431    owner 
   TABLE DATA           )   COPY public.owner (ci, name) FROM stdin;
    public               postgres    false    225   i       T          0    16465    owner_property 
   TABLE DATA           ?   COPY public.owner_property (owner_id, property_id) FROM stdin;
    public               postgres    false    228   �i       I          0    16389 
   permission 
   TABLE DATA           .   COPY public.permission (id, name) FROM stdin;
    public               postgres    false    217   �j       K          0    16393    permissions_roles 
   TABLE DATA           G   COPY public.permissions_roles (id, permissions_id, rol_id) FROM stdin;
    public               postgres    false    219   Bk       S          0    16447    property 
   TABLE DATA           �   COPY public.property (property_id, manzano, batch, state, meters, price, folio_number, numero_inmueble, testimony_numbre, location, property_number) FROM stdin;
    public               postgres    false    227   �k       \          0    16546    property_users 
   TABLE DATA           >   COPY public.property_users (property_id, user_id) FROM stdin;
    public               postgres    false    236   .m       M          0    16397    role 
   TABLE DATA           -   COPY public.role (role_id, name) FROM stdin;
    public               postgres    false    221   en       O          0    16401    users 
   TABLE DATA           D   COPY public.users (user_id, username, password, rol_id) FROM stdin;
    public               postgres    false    223   �n       k           0    0 "   adjudicatario_id_adjudicatario_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.adjudicatario_id_adjudicatario_seq', 20, true);
          public               postgres    false    231            l           0    0    inmueble_inmueble_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.inmueble_inmueble_id_seq', 29, true);
          public               postgres    false    226            m           0    0    notficacion_id_notificacion_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.notficacion_id_notificacion_seq', 1, false);
          public               postgres    false    233            n           0    0    observacion_id_observacion_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.observacion_id_observacion_seq', 1, false);
          public               postgres    false    229            o           0    0    permissions_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.permissions_id_seq', 5, true);
          public               postgres    false    218            p           0    0    permissions_roles_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.permissions_roles_id_seq', 8, true);
          public               postgres    false    220            q           0    0    roles_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.roles_id_seq', 2, true);
          public               postgres    false    222            r           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 7, true);
          public               postgres    false    224            �           2606    16513    customer adjudicatario_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT adjudicatario_pkey PRIMARY KEY (customer_id);
 E   ALTER TABLE ONLY public.customer DROP CONSTRAINT adjudicatario_pkey;
       public                 postgres    false    232            �           2606    16530 G   notification_customer_property inmueble_adjudicatario_notificacion_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.notification_customer_property
    ADD CONSTRAINT inmueble_adjudicatario_notificacion_pkey PRIMARY KEY (notification_id, customer_id, id_inmueble);
 q   ALTER TABLE ONLY public.notification_customer_property DROP CONSTRAINT inmueble_adjudicatario_notificacion_pkey;
       public                 postgres    false    235    235    235            �           2606    16452    property inmueble_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.property
    ADD CONSTRAINT inmueble_pkey PRIMARY KEY (property_id);
 @   ALTER TABLE ONLY public.property DROP CONSTRAINT inmueble_pkey;
       public                 postgres    false    227            �           2606    16550 $   property_users inmueble_usuario_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.property_users
    ADD CONSTRAINT inmueble_usuario_pkey PRIMARY KEY (user_id, property_id);
 N   ALTER TABLE ONLY public.property_users DROP CONSTRAINT inmueble_usuario_pkey;
       public                 postgres    false    236    236            �           2606    16525    notification notficacion_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notficacion_pkey PRIMARY KEY (notification_id);
 G   ALTER TABLE ONLY public.notification DROP CONSTRAINT notficacion_pkey;
       public                 postgres    false    234            �           2606    16486    observation observacion_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observacion_pkey PRIMARY KEY (observation_id);
 F   ALTER TABLE ONLY public.observation DROP CONSTRAINT observacion_pkey;
       public                 postgres    false    230            �           2606    16410    permission permissions_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
 E   ALTER TABLE ONLY public.permission DROP CONSTRAINT permissions_pkey;
       public                 postgres    false    217            �           2606    16412 (   permissions_roles permissions_roles_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.permissions_roles
    ADD CONSTRAINT permissions_roles_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.permissions_roles DROP CONSTRAINT permissions_roles_pkey;
       public                 postgres    false    219            �           2606    16464    owner propietario_ci_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.owner
    ADD CONSTRAINT propietario_ci_unique UNIQUE (ci);
 E   ALTER TABLE ONLY public.owner DROP CONSTRAINT propietario_ci_unique;
       public                 postgres    false    225            �           2606    16469 (   owner_property propietario_inmueble_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public.owner_property
    ADD CONSTRAINT propietario_inmueble_pkey PRIMARY KEY (owner_id, property_id);
 R   ALTER TABLE ONLY public.owner_property DROP CONSTRAINT propietario_inmueble_pkey;
       public                 postgres    false    228    228            �           2606    16414    role roles_nombre_key 
   CONSTRAINT     P   ALTER TABLE ONLY public.role
    ADD CONSTRAINT roles_nombre_key UNIQUE (name);
 ?   ALTER TABLE ONLY public.role DROP CONSTRAINT roles_nombre_key;
       public                 postgres    false    221            �           2606    16416    role roles_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.role
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);
 9   ALTER TABLE ONLY public.role DROP CONSTRAINT roles_pkey;
       public                 postgres    false    221            �           2606    16418    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    223            �           2606    16420    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    223            �           2606    16541 X   notification_customer_property inmueble_adjudicatario_notificacion_id_adjudicatario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification_customer_property
    ADD CONSTRAINT inmueble_adjudicatario_notificacion_id_adjudicatario_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
 �   ALTER TABLE ONLY public.notification_customer_property DROP CONSTRAINT inmueble_adjudicatario_notificacion_id_adjudicatario_fkey;
       public               postgres    false    4775    235    232            �           2606    16536 S   notification_customer_property inmueble_adjudicatario_notificacion_id_inmueble_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification_customer_property
    ADD CONSTRAINT inmueble_adjudicatario_notificacion_id_inmueble_fkey FOREIGN KEY (id_inmueble) REFERENCES public.property(property_id);
 }   ALTER TABLE ONLY public.notification_customer_property DROP CONSTRAINT inmueble_adjudicatario_notificacion_id_inmueble_fkey;
       public               postgres    false    235    227    4769            �           2606    16531 W   notification_customer_property inmueble_adjudicatario_notificacion_id_notificacion_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification_customer_property
    ADD CONSTRAINT inmueble_adjudicatario_notificacion_id_notificacion_fkey FOREIGN KEY (notification_id) REFERENCES public.notification(notification_id);
 �   ALTER TABLE ONLY public.notification_customer_property DROP CONSTRAINT inmueble_adjudicatario_notificacion_id_notificacion_fkey;
       public               postgres    false    4777    234    235            �           2606    16556 0   property_users inmueble_usuario_id_inmueble_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.property_users
    ADD CONSTRAINT inmueble_usuario_id_inmueble_fkey FOREIGN KEY (property_id) REFERENCES public.property(property_id);
 Z   ALTER TABLE ONLY public.property_users DROP CONSTRAINT inmueble_usuario_id_inmueble_fkey;
       public               postgres    false    236    4769    227            �           2606    16551 /   property_users inmueble_usuario_id_usuario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.property_users
    ADD CONSTRAINT inmueble_usuario_id_usuario_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 Y   ALTER TABLE ONLY public.property_users DROP CONSTRAINT inmueble_usuario_id_usuario_fkey;
       public               postgres    false    236    4763    223            �           2606    16487 (   observation observacion_id_inmueble_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observacion_id_inmueble_fkey FOREIGN KEY (property_id) REFERENCES public.property(property_id);
 R   ALTER TABLE ONLY public.observation DROP CONSTRAINT observacion_id_inmueble_fkey;
       public               postgres    false    230    227    4769            �           2606    16421 /   permissions_roles permissions_roles_rol_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.permissions_roles
    ADD CONSTRAINT permissions_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.role(role_id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.permissions_roles DROP CONSTRAINT permissions_roles_rol_id_fkey;
       public               postgres    false    4761    219    221            �           2606    16475 4   owner_property propietario_inmueble_id_inmueble_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.owner_property
    ADD CONSTRAINT propietario_inmueble_id_inmueble_fkey FOREIGN KEY (property_id) REFERENCES public.property(property_id);
 ^   ALTER TABLE ONLY public.owner_property DROP CONSTRAINT propietario_inmueble_id_inmueble_fkey;
       public               postgres    false    4769    227    228            �           2606    16470 7   owner_property propietario_inmueble_id_propietario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.owner_property
    ADD CONSTRAINT propietario_inmueble_id_propietario_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(ci);
 a   ALTER TABLE ONLY public.owner_property DROP CONSTRAINT propietario_inmueble_id_propietario_fkey;
       public               postgres    false    225    4767    228            �           2606    16426    users users_rol_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.role(role_id) ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.users DROP CONSTRAINT users_rol_id_fkey;
       public               postgres    false    223    4761    221            X   e  x���]k�0��OE~����eQ�
CEvsf3�d9�&^���tSd[�f%�'�y�$�e�KtǠ���7���R�%�O���`�5]�ʼ(��'9�9��c��I�����1��N�2�%+f��C�����L)�Z5�uػ��Vh�c��MQ��)o�,����c�j2�|�,���:�IL����Y�_7$P��)�2�5-/vtJ��14�cV�+�d�̤�)p���z����Z���5�f�@cl��ӣ�ÚN\W̕�k��N���MRO[*���k�j�����%L��-��~<�C�ŦgD��h�7���f��P�2��aq2L�<��d��J�EG=�EQ��j�F      Z      x������ � �      [      x������ � �      V      x������ � �      Q   �   x�]��
�0E��+�H��<3�B�n�ˣ��`B�{q�w=��E�}�!����f����h�U;M0N���E�(,��@�Z�g}<4Օ�q�!q�}*|��\�%�=F�`��UOk�w����㠵� V�5d      T   +  x�MԻmAQ[�0���E�ǡ�I`5-:e��s��ޯ�����-�w[�n�m߻�g�o\��q5�1M��Wӫ�4�fT3���A3����j&ͤYլjV5�f��jv5��M�iN5��S͡94��[ͭ��\5�ڸj�-��"�!<$�!H�B���p!`

��!x(|(�!��0�@�P"�'�B����"�-
.
/�#�(�(�5��p����c�9F�C�C��c�99�_�$�I���'!��1r���#��1rrr�#��q�q�1r�#�!���������l      I   P   x�3�,NM�/(�/H-*��2�LM�,A��9�R�S�ʐ��p&'�%���CdK2��L9�2�K��S�3�KS�b���� S�!&      K   /   x�3�4�4�2�4�&��@Ҕ�H��F\�@��P�W� ��      S   �  x���An�0E��>@�1���T��RUu����"�MH=}�@�	n�x�3���#���:]���g�AL�ͺ��ӂ>V���~���q^%8,�ECd���rJ8��|ԇ��\D�`��b���'[�����;Z���mQ��Wjj���4���ϖ����N�C�uV�U�bؚDr�t���͔�G�1���'S5�u�2�Z��O�·��B]��F$w6�I�a����,����D�a�i�1����2�w)�y��F��DSfw���֖f�oL�;�Å�3bL�b�����I�At�� s�ݺ�m��Lޮ��ںzU�:�p�rZ���4婓������鹆��N��C��_o��ƃ����)ڤ,���"w�T�,�]@�YJ��~^k���Ѐ�      \   '  x�ҹq�0��*ƣI���:�e�d��燋��ٷ������=�iO�h��}����>�g�l���}���վ�W�j_��}���ݾ�w����?�O������o������o�����_����s;�v����m��n���>���3��8��|܏ (�h����(�h���� (�$h�(��,�0(�4h�8��<�@(�Dh�H��L�P(�Th��U��V�*ZE�h��U�ʹ�s(�RΩ�[9ǢU��V�*ZE�h��U��V�*ZE�h��U��V�*ZE�h�����u]��K_)      M      x�3�LL����2��/�K-����� AUf      O   k  x�]ϻ��0 ���bk.�"S `��l "8$�(2O?N��/��7�o����w*,@�P�����~�kkǏZ�4��$����%��"��b����;Hu� DU Uװ�6���.�Qe_;��r��I
MRr*�Gl�t�Ist�{�4�/+{~͂*j�G�������W:w���1=s���Z2����&�0!�xh�1�&��0��{��=W�����?���@�Mթ�0u%����� #��L/*G�s_j1,͗f��r~���8RM���Y�G�.0�>2�������j=��J�mV�/�<:�q��(�z"�xKo���=E�XnGyJ���!c�����j�����(�?2�I     